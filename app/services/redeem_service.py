import os
from urllib.parse import urlparse
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException, status
from app.models.redeem_item import RedeemItem
from app.models.redeem_history import RedeemHistory
from app.models.user import User  # pastikan kamu punya model User dengan field "points"
from app.utils.config import settings
from sqlalchemy.orm import joinedload
from sqlalchemy.exc import SQLAlchemyError

UPLOAD_DIR = "uploads/redeem_items"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class RedeemItemService:
    @staticmethod
    def create_item(db: Session, name: str, points_required: int,  stock: int, description:str, file: UploadFile = None):
        """Buat item baru untuk redeem store"""

        image_url = None
        if file:
            file_path = os.path.join(UPLOAD_DIR, file.filename)
            with open(file_path, "wb") as f:
                f.write(file.file.read())
            image_url = f"{settings.BACKEND_URL}/uploads/redeem_items/{file.filename}"

        new_item = RedeemItem(
            name=name,
            image_url=image_url,
            points_required=points_required,
            stock=stock,
            description=description,
        )
        db.add(new_item)
        db.commit()
        db.refresh(new_item)
        return new_item

    @staticmethod
    def get_all_items(db: Session):
        """Ambil semua item redeem"""
        return db.query(RedeemItem).order_by(RedeemItem.created_at.desc()).all()

    @staticmethod
    def get_item_by_id(db: Session, item_id: int):
        item = db.query(RedeemItem).filter(RedeemItem.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item tidak ditemukan")
        return item

    @staticmethod
    def update_item_by_id(
        db: Session,
        item_id: int,
        name: str = None,
        points_required: int = None,
        stock: int = None,
        description:str =None,
        file: UploadFile = None
    ):
        """Update item redeem berdasarkan ID"""
        item = db.query(RedeemItem).filter(RedeemItem.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item tidak ditemukan")

        # Update field jika ada perubahan
        if name is not None:
            item.name = name
        if points_required is not None:
            item.points_required = points_required
        if stock is not None:
            item.stock = stock
        if description is not None:
            item.description = description
        # Jika ada file gambar baru, simpan dan update URL
        if file:
            file_path = os.path.join(UPLOAD_DIR, file.filename)
            with open(file_path, "wb") as f:
                f.write(file.file.read())
            item.image_url = f"{settings.BACKEND_URL}/uploads/redeem_items/{file.filename}"

        db.commit()
        db.refresh(item)
        return item
    

    @staticmethod
    def redeem_item(db: Session, user_id: int, item_id: int):
        """Proses penukaran poin user dengan item redeem"""

        # Ambil data user & item
        user = db.query(User).filter(User.id == user_id).first()
        item = db.query(RedeemItem).filter(RedeemItem.id == item_id).first()

        if not user:
            raise HTTPException(status_code=404, detail="User tidak ditemukan")
        if not item:
            raise HTTPException(status_code=404, detail="Item tidak ditemukan")

        # Cek stok
        if item.stock <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Stok item habis"
            )

        # Cek poin user
        if user.total_points < item.points_required:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Poin Anda tidak cukup untuk menukarkan item ini"
            )

        # Kurangi poin & stok
        user.total_points -= item.points_required
        item.stock -= 1

        # Simpan ke history
        history = RedeemHistory(
            user_id=user_id,
            item_id=item_id,
            points_spent=item.points_required
        )
        db.add(history)
        db.commit()
        db.refresh(history)

        return history

    @staticmethod
    def get_user_history(db: Session, user_id: int):
        """Ambil semua riwayat redeem user + detail item"""
        return (
            db.query(RedeemHistory)
            .options(joinedload(RedeemHistory.item))  # 🔥 ini kunci utamanya
            .filter(RedeemHistory.user_id == user_id)
            .order_by(RedeemHistory.created_at.desc())
            .all()
        )

    @staticmethod
    def delete_item_by_id(db: Session, item_id: int):
        """Hapus item redeem berdasarkan ID"""
        item = db.query(RedeemItem).filter(RedeemItem.id == item_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="Item tidak ditemukan")

        try:
            # Hapus history terkait lebih dulu agar tidak memicu NOT NULL constraint.
            db.query(RedeemHistory).filter(RedeemHistory.item_id == item_id).delete(synchronize_session=False)

            # Hapus file gambar jika ada
            if item.image_url:
                parsed_path = urlparse(item.image_url).path or item.image_url
                image_path = parsed_path.lstrip("/")
                if os.path.exists(image_path):
                    os.remove(image_path)

            db.delete(item)
            db.commit()
            return {"message": f"Item '{item.name}' berhasil dihapus"}
        except SQLAlchemyError:
            db.rollback()
            raise HTTPException(status_code=500, detail="Gagal menghapus item")

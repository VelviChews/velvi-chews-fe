import uuid
import os
import qrcode
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.ar_card import ARCard

QR_FOLDER = "qr_codes"


def create_card(db: Session, label: str, points: int) -> ARCard:
    """Create a new AR card, generate QR code image, save to DB."""
    os.makedirs(QR_FOLDER, exist_ok=True)

    card_code = str(uuid.uuid4())

    # Generate QR image
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(card_code)
    qr.make(fit=True)
    # Harus gelap/kontras tinggi agar kamera bisa scan, pink muda gagal dibaca scanner
    img = qr.make_image(fill_color="#000000", back_color="white")

    filename = f"{card_code}.png"
    filepath = os.path.join(QR_FOLDER, filename)
    img.save(filepath)

    card = ARCard(
        card_code=card_code,
        label=label,
        points=points,
        qr_image_path=f"/qr_codes/{filename}",
    )
    db.add(card)
    db.commit()
    db.refresh(card)
    return card


def get_all_cards(db: Session):
    return db.query(ARCard).order_by(ARCard.created_at.desc()).all()


def get_card_by_code(db: Session, card_code: str) -> ARCard:
    card = db.query(ARCard).filter(ARCard.card_code == card_code).first()
    if not card:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="QR Card tidak ditemukan")
    return card


def delete_card(db: Session, card_code: str):
    card = get_card_by_code(db, card_code)

    # Delete the image file if it exists
    if card.qr_image_path:
        filepath = card.qr_image_path.lstrip("/")
        if os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception as e:
                print(f"Failed to delete QR image {filepath}: {e}")

    db.delete(card)
    db.commit()
    return {"message": "Card deleted successfully"}

from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session
from app.models.user import User
from pathlib import Path
import os
import shutil

UPLOAD_DIR = "uploads"


class UserService:
    @staticmethod
    def get_my_profile(db: Session, current_user: User):
        """Ambil data profil user yang sedang login"""
        return current_user

    @staticmethod
    def update_my_profile(db: Session, current_user: User, name: str = None, file: UploadFile = None):
        """Update data user yang sedang login (nama / foto profil)"""

        # Pastikan folder upload ada
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        # Update nama jika dikirim
        if name:
            current_user.name = name

        # Update foto profil jika dikirim
        if file:
            filename = f"user_{current_user.id}_{file.filename}"
            file_path = os.path.join(UPLOAD_DIR, filename)

            # Simpan file ke folder uploads
            with open(file_path, "wb") as f:
                shutil.copyfileobj(file.file, f)

            # Simpan URL relatif (biar bisa diakses dari frontend)
            current_user.profile_picture = filename

        db.commit()
        db.refresh(current_user)

        return current_user

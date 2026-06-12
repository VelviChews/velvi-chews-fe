from fastapi import APIRouter, Depends, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.schemas.user_schema import UserResponse
from app.utils.config import settings

router = APIRouter(prefix="/users", tags=["Users"])

# ========== GET Profile (diri sendiri) ==========
@router.get("/me", response_model=UserResponse)
def get_my_profile(
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(AuthService.get_current_user)
):
    user = UserService.get_my_profile(db, current_user)

    # Buat URL lengkap supaya bisa langsung dipakai di frontend
    if user.profile_picture:
        user.profile_picture = f"{request.base_url}uploads/{user.profile_picture}"

    return user

# ========== UPDATE Profile (nama / foto profil) ==========
@router.put("/me", response_model=UserResponse)
def update_my_profile(
    name: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(AuthService.get_current_user)
):
    updated_user = UserService.update_my_profile(db, current_user, name, file)

    # Pastikan frontend dapat URL lengkap juga
    if updated_user.profile_picture:
        updated_user.profile_picture = f"{settings.BACKEND_URL}/uploads/{updated_user.profile_picture}"

    return updated_user

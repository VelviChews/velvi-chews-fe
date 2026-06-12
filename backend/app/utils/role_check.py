from fastapi import Depends, HTTPException, status
from app.services.auth_service import AuthService
from app.database import get_db

def admin_required(
    current_user = Depends(AuthService.get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Hanya admin yang bisa mengakses fitur ini"
        )
    return current_user

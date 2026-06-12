from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ==============================
# 🧩 1. Base Schema
# ==============================
class UserBase(BaseModel):
    name: str
    email: EmailStr
    total_points: int = 0
    profile_picture: Optional[str] = None

# ==============================
# 🧩 3. Update Schema (Update profile, upload PP, dll)
# ==============================
class UserUpdate(BaseModel):
    name: Optional[str] = None
    profile_picture: Optional[str] = None

# ==============================
# 🧩 4. Response Schema (Return ke Frontend)
# ==============================
class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    total_points: int  # <- tetap ditampilkan, tapi tidak bisa diubah manual
    profile_picture: Optional[str] = None
    role:str
    created_at: datetime
    updated_at: datetime


    class Config:
        orm_mode = True  # penting supaya bisa return langsung dari SQLAlchemy object

from pydantic import BaseModel, EmailStr,Field
from typing import Optional


# === Untuk input saat register ===
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)


# === Untuk input saat login ===
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# === Untuk response setelah login ===
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr


class RegisterResponse(BaseModel):
    message: str
    user: UserResponse
    class Config:
        orm_mode = True


class ForgotPasswordSchema(BaseModel):
    email: EmailStr

class ResetPasswordSchema(BaseModel):
    token: str
    new_password: str

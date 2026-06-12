from datetime import timedelta,datetime
import uuid
import requests
from fastapi import HTTPException, status,Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.utils.security import verify_password, hash_password, create_access_token, decode_access_token
from app.models.user import User  # Model SQLAlchemy kamu
from app.utils.config import settings
from app.database import get_db
from app.utils.email_verification import create_verification_token
from app.utils.mailer import send_verification_email
from passlib.context import CryptContext

GAS_URL = settings.GAS_URL 

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
    

class AuthService:
    @staticmethod
    def register_user(db: Session, email: str, password: str, name: str):
        """Register user baru"""
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email sudah terdaftar"
            )
        if len(password.encode('utf-8')) > 72:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password terlalu panjang (maks 72 karakter ASCII)."
            )

        hashed_pw = hash_password(password)
        new_user = User(email=email, password_hash=hashed_pw, name=name,total_points=0)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token = create_verification_token(email)
        # Kirim email (async)
        send_verification_email(email, token)


        return {"message": "Registrasi berhasil. Cek email untuk verifikasi.",
                "user": new_user}

    @staticmethod
    def login_user(db: Session, email: str, password: str):
        """Autentikasi user dan buat JWT"""
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email atau password salah",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if not user.is_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Akun belum diverifikasi. Silakan cek email kamu untuk verifikasi."
        )
        from app.models.login_history import LoginHistory
        login_record = LoginHistory(user_id=user.id)
        db.add(login_record)
        db.commit()

        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user.id),"name": user.name,"email": user.email,"role": user.role},  # sub = subject (user id)
            expires_delta=access_token_expires
        )

        return {"access_token": access_token, "token_type": "bearer"}

    @staticmethod
    def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: Session = Depends(get_db)
    ):
        payload = decode_access_token(token)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token tidak valid atau sudah kadaluarsa",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User tidak ditemukan",
            )

        return user
    @staticmethod
    def request_password_reset(email: str, db: Session):
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return  # jangan bocorkan bahwa email tidak ada

        token = str(uuid.uuid4())
        expire = datetime.utcnow() + timedelta(minutes=30)

        user.reset_token = token
        user.reset_token_expire = expire
        db.commit()
        
        

        reset_link = f"{settings.FRONTEND_URL}/reset-password?token={token}"

        message = f"""
<html>
  <body>
    <h2>Reset Password</h2>
    <p>Klik tombol di bawah untuk reset password:</p>
    <a href="{reset_link}" 
       style="padding: 10px 20px; background #FC809F; color: white; 
              text-decoration: none; border-radius: 6px;">
       Reset Password
    </a>
    <p>Atau copy dan paste link berikut ke browser:</p>
    <p>{reset_link}</p>
    <br>
    <p>Link berlaku selama <b>30 menit</b>.</p>
  </body>
</html>
"""

        # Kirim email melalui App Script
        response = requests.post(GAS_URL, json={
        "email": email,
        "subject": "Reset Password",
        "body": message
    })
        return True


    @staticmethod
    def reset_password(token: str, new_password: str, db: Session):
        user = db.query(User).filter(User.reset_token == token).first()
        if not user:
            return "invalid"

        if user.reset_token_expire < datetime.utcnow():
            return "expired"

        hashed = hash_password(new_password)

        user.password_hash = hashed
        user.reset_token = None
        user.reset_token_expire = None
        db.commit()

        return "success"
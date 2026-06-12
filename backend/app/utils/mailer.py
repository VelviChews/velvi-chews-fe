# app/utils/mailer.py
import requests
from app.utils.config import settings

GAS_URL = settings.GAS_URL  # pastikan sudah di .env

def send_verification_email(email: str, token: str):
    verification_link = f"{settings.BACKEND_URL}/auth/verify-email?token={token}"

    body = f"""
<div style="font-family: Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #333;">
  
  <p>Hai Velvi Buddies!</p>
  <p>
    Terima kasih sudah bergabung! Untuk mengaktifkan akunmu dan mulai menikmati pengalaman 
    seru di Velvi Chews, klik link berikut:
  </p>

  <p style="margin: 20px 0; font-weight: bold;">
    <a href="{verification_link}" style="color: #0066cc;">{verification_link}</a>
  </p>

  <p>
    Kalau link tidak bisa diklik, cukup salin dan tempel di browser.
  </p>

  <p>
    Selamat bersenang-senang!<br>
    <strong>Tim Velvi Chews</strong>
  </p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

  <p>Hi Velvi Buddies!</p>
  <p>
    Thank you for joining! To activate your account and start enjoying the exciting 
    experience at Velvi Chews, click the following link:
  </p>

  <p style="margin: 20px 0; font-weight: bold;">
    <a href="{verification_link}" style="color: #0066cc;">{verification_link}</a>
  </p>

  <p>
    If the link cannot be clicked, simply copy and paste it into your browser.
  </p>

  <p>
    Have fun!<br>
    <strong>The Velvi Chews Team</strong>
  </p>

</div>
"""


    payload = {
        "email": email,
        "subject": "Verifikasi Akun Kamu",
        "body": body  
    }
    try:
        response = requests.post(GAS_URL, json=payload, timeout=10)
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.RequestException as e:
        print("🚨 Error saat kirim ke GAS:", str(e))
        return False

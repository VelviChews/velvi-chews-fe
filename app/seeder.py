from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.ar_card import ARCard
from app.utils.security import hash_password, create_access_token
from app.utils.config import settings
from app.services.card_service import create_card

# Create table jika belum ada
Base.metadata.create_all(bind=engine)

def seed_admin(db: Session):
    admin_email = settings.ADMIN_EMAIL
    existing_admin = db.query(User).filter(User.email == admin_email).first()
    if existing_admin:
        print("Admin sudah ada, skip seeding ✅")
        return

    # Buat admin baru
    admin = User(
        name="Admin",
        email=admin_email,
        password_hash=hash_password(settings.ADMIN_PASSWORD),
        role="admin",
        is_verified=True
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    token_payload = {
        "name": admin.name,
        "email": admin.email,
        "role": admin.role
    }
    token = create_access_token(token_payload)
    print(f"Admin berhasil dibuat ✅")


def seed_ar_cards(db: Session):
    """Seed sample AR QR cards jika belum ada data."""
    existing = db.query(ARCard).first()
    if existing:
        print("AR Cards sudah ada, skip seeding ✅")
        return

    sample_cards = [
        {"label": "Gummy Bear Stroberi", "points": 10},
        {"label": "Gummy Bear Mangga",   "points": 15},
        {"label": "Gummy Bear Anggur",   "points": 20},
        {"label": "Gummy Bear Lemon",    "points": 25},
        {"label": "Gummy Bear Spesial",  "points": 50},
    ]

    for card_data in sample_cards:
        create_card(db, card_data["label"], card_data["points"])
        print(f"  ✅ QR Card dibuat: {card_data['label']} ({card_data['points']} poin)")

    print("Seeding AR Cards selesai 🎉")


if __name__ == "__main__":
    db = SessionLocal()
    seed_admin(db)
    seed_ar_cards(db)
    db.close()


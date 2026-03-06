from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.ar_card import ARCard
from app.models.scan_history import ScanHistory
from app.models.user import User


def process_scan(db: Session, card_code: str, user_id: int) -> dict:
    """Process a QR scan: validate card, check duplicate, add points."""

    # 1. Find the card
    card = db.query(ARCard).filter(ARCard.card_code == card_code).first()
    if not card:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="QR Code tidak valid atau tidak ditemukan"
        )

    # 2. Check if this user already scanned this card
    already_scanned = db.query(ScanHistory).filter(
        ScanHistory.user_id == user_id,
        ScanHistory.card_id == card.id
    ).first()
    if already_scanned:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Kamu sudah pernah scan QR ini sebelumnya"
        )

    # 3. Record the scan
    history = ScanHistory(
        user_id=user_id,
        card_id=card.id,
        points_received=card.points,
    )
    db.add(history)

    # 4. Add points to user
    user = db.query(User).filter(User.id == user_id).first()
    user.total_points = (user.total_points or 0) + card.points
    db.commit()
    db.refresh(user)

    return {
        "message": f"Selamat! Kamu mendapatkan {card.points} poin dari scan ini 🎉",
        "points_received": card.points,
        "total_points": user.total_points,
        "label": card.label,
    }


def get_scan_history(db: Session, user_id: int):
    """Get all scan history for a user, ordered by latest."""
    return (
        db.query(ScanHistory, ARCard)
        .join(ARCard, ScanHistory.card_id == ARCard.id)
        .filter(ScanHistory.user_id == user_id)
        .order_by(ScanHistory.created_at.desc())
        .all()
    )

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.card_schema import ScanRequest, ScanResponse
from app.services import scan_service
from app.services.auth_service import AuthService
from typing import List

router = APIRouter(prefix="/scan", tags=["Scan"])


@router.post("", response_model=ScanResponse)
def scan_qr(
    data: ScanRequest,
    db: Session = Depends(get_db),
    current_user=Depends(AuthService.get_current_user),
):
    """Authenticated user: Scan a QR code to earn points."""
    return scan_service.process_scan(db, data.card_code, current_user.id)


@router.get("/history")
def get_my_scan_history(
    db: Session = Depends(get_db),
    current_user=Depends(AuthService.get_current_user),
):
    """Get scan history for the current user."""
    results = scan_service.get_scan_history(db, current_user.id)
    return [
        {
            "id": record.ScanHistory.id,
            "title": f"Scan QR — {record.ARCard.label}",
            "points": record.ScanHistory.points_received,
            "created_at": record.ScanHistory.created_at.isoformat() if record.ScanHistory.created_at else None,
            "type": "scan",
        }
        for record in results
    ]

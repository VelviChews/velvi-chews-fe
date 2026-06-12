import os
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.card_schema import CreateCardRequest, CardResponse, AdminScanHistoryResponse
from app.services import card_service
from app.utils.role_check import admin_required
from typing import List

router = APIRouter(prefix="/cards", tags=["AR Cards"])


@router.post("", response_model=CardResponse)
def create_card(
    data: CreateCardRequest,
    db: Session = Depends(get_db),
    _: None = Depends(admin_required),
):
    """Admin only: Create a new AR card and generate its QR code."""
    return card_service.create_card(db, data.label, data.points)


@router.get("", response_model=List[CardResponse])
def list_cards(
    db: Session = Depends(get_db),
    _: None = Depends(admin_required),
):
    """Admin only: List all AR cards."""
    return card_service.get_all_cards(db)


@router.get("/{card_code}/history", response_model=List[AdminScanHistoryResponse])
def get_card_history_admin_api(
    card_code: str,
    db: Session = Depends(get_db),
    _: None = Depends(admin_required),
):
    """Admin only: Get scan history for a specific AR card."""
    return card_service.get_card_history_admin(db, card_code)


@router.get("/{card_code}/qr")
def get_qr_image(
    card_code: str,
    db: Session = Depends(get_db),
    _: None = Depends(admin_required),
):
    """Admin only: Download QR image for a specific card."""
    card = card_service.get_card_by_code(db, card_code)
    # Strip leading slash for filesystem path
    filepath = card.qr_image_path.lstrip("/")
    if not os.path.exists(filepath):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="QR image not found on disk")
    return FileResponse(filepath, media_type="image/png", filename=f"{card_code}.png")


@router.delete("/{card_code}")
def delete_card(
    card_code: str,
    db: Session = Depends(get_db),
    _: None = Depends(admin_required),
):
    """Admin only: Delete an AR card."""
    return card_service.delete_card(db, card_code)

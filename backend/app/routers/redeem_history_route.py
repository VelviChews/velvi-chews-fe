from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.redeem_schema import RedeemHistoryCreate, RedeemHistoryResponse
from app.services.redeem_service import RedeemItemService
from app.services.auth_service import AuthService

router = APIRouter(prefix="/redeem-history", tags=["Redeem History"])


# ========== REDEEM ITEM ==========
@router.post("/", response_model=RedeemHistoryResponse)
def redeem_item(
    payload: RedeemHistoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(AuthService.get_current_user)
):
    """
    User menukar poin dengan item redeem.
    """
    return RedeemItemService.redeem_item(db, current_user.id, payload.item_id)


# ========== GET USER REDEEM HISTORY ==========
@router.get("/", response_model=list[RedeemHistoryResponse])
def get_my_redeem_history(
    db: Session = Depends(get_db),
    current_user=Depends(AuthService.get_current_user)
):
    """
    Ambil semua riwayat redeem milik user yang login.
    """
    return RedeemItemService.get_user_history(db, current_user.id)

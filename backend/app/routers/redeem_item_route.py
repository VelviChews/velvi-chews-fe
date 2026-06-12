from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.redeem_schema import RedeemItemResponse, AdminRedeemHistoryResponse
from app.services.redeem_service import RedeemItemService
from app.utils.role_check import admin_required

router = APIRouter(prefix="/redeem-items", tags=["Redeem Items"])


# ========== CREATE ITEM (Admin) ==========
@router.post("/", response_model=RedeemItemResponse)
def create_redeem_item(
    name: str = Form(...),
    points_required: int = Form(...),
    stock: int = Form(...),
    description:str=Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(admin_required)  # ← hanya admin bisa
):
    return RedeemItemService.create_item(db, name, points_required,stock,description,file)


# ========== GET ALL ITEMS ==========
@router.get("/", response_model=list[RedeemItemResponse])
def get_all_redeem_items(db: Session = Depends(get_db)):
    return RedeemItemService.get_all_items(db)


# ========== GET ALL ITEMS (Admin) ==========
@router.get("/admin", response_model=list[RedeemItemResponse])
def get_all_redeem_items_admin(
    db: Session = Depends(get_db),
    current_user = Depends(admin_required)
):
    return RedeemItemService.get_all_items(db)


# ========== GET ITEM DETAIL ==========
@router.get("/{item_id}", response_model=RedeemItemResponse)
def get_redeem_item_detail(item_id: int, db: Session = Depends(get_db)):
    return RedeemItemService.get_item_by_id(db, item_id)


# ========== GET ITEM HISTORY (Admin) ==========
@router.get("/{item_id}/history", response_model=list[AdminRedeemHistoryResponse])
def get_item_history_admin_api(
    item_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(admin_required)
):
    return RedeemItemService.get_item_history_admin(db, item_id)


@router.put("/{item_id}")
async def update_redeem_item(
    item_id: int,
    name: str = Form(None),
    points_required: int = Form(None),
    stock: int = Form(None),
    description:str=Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user = Depends(admin_required)  # ← hanya admin bisa
):
    return RedeemItemService.update_item_by_id(db, item_id, name, points_required, stock,description,file)

# ========== DELETE ITEM (Admin) ==========
@router.delete("/{item_id}")
def delete_redeem_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(admin_required) 
):
    return RedeemItemService.delete_item_by_id(db, item_id)

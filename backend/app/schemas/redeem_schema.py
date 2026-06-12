from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ==================== Base Schema ====================
class RedeemItemBase(BaseModel):
    name: str
    image_url: Optional[str] = None
    points_required: int
    description:str
    stock: int


# ==================== Create Schema ====================
class RedeemItemCreate(RedeemItemBase):
    pass


# ==================== Response Schema ====================
class RedeemItemResponse(RedeemItemBase):
    id: int
    created_at: datetime


class RedeemHistoryBase(BaseModel):
    item_id: int

class RedeemHistoryCreate(RedeemHistoryBase):
    pass

class RedeemHistoryResponse(BaseModel):
    id: int
    user_id: int
    item_id: int
    points_spent: int
    created_at: datetime
    item: Optional[RedeemItemResponse] = None

    class Config:
        orm_mode = True
        from_attributes = True

class UserBasicInfo(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        orm_mode = True
        from_attributes = True

class AdminRedeemHistoryResponse(BaseModel):
    id: int
    user_id: int
    points_spent: int
    created_at: datetime
    user: UserBasicInfo

    class Config:
        orm_mode = True
        from_attributes = True

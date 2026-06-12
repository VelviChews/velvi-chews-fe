from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CreateCardRequest(BaseModel):
    label: str
    points: int


class CardResponse(BaseModel):
    id: int
    card_code: str
    label: str
    points: int
    qr_image_path: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ScanRequest(BaseModel):
    card_code: str


class ScanResponse(BaseModel):
    message: str
    points_received: int
    total_points: int
    label: str

class UserBasicInfo(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        orm_mode = True
        from_attributes = True

class AdminScanHistoryResponse(BaseModel):
    id: int
    user_id: int
    points_received: int
    created_at: datetime
    user: UserBasicInfo

    class Config:
        orm_mode = True
        from_attributes = True

from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from ..database import Base

class ARCard(Base):
    __tablename__ = "ar_cards"

    id = Column(Integer, primary_key=True, index=True)
    card_code = Column(String(100), unique=True, nullable=False)
    label = Column(String(200), nullable=False, default="AR Card")
    points = Column(Integer, nullable=False)
    qr_image_path = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

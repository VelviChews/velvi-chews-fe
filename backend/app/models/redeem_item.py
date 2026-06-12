from sqlalchemy import Column, Integer, String, DateTime,Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..database import Base

class RedeemItem(Base):
    __tablename__ = "redeem_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    image_url = Column(String(255))
    points_required = Column(Integer, nullable=False)
    description = Column(Text, nullable=True)
    stock = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    redeems = relationship("RedeemHistory", back_populates="item")

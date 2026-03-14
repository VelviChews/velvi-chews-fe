from sqlalchemy import Column, Integer, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class RedeemHistory(Base):
    __tablename__ = "redeem_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    item_id = Column(Integer, ForeignKey("redeem_items.id", ondelete="CASCADE"), nullable=False)
    points_spent = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    item = relationship("RedeemItem", back_populates="redeems")
    user = relationship("User")


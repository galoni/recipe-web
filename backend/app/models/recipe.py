from sqlalchemy import String, Integer, JSON, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import datetime
from app.core.database import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .user import User

class Recipe(Base):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    video_url: Mapped[str] = mapped_column(String)
    thumbnail_url: Mapped[str | None] = mapped_column(String, nullable=True)
    ingredients: Mapped[list[dict]] = mapped_column(JSON) # List of {item: str, amount: str}
    steps: Mapped[list[dict]] = mapped_column(JSON) # List of {time: str, instruction: str}
    
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    owner: Mapped["User"] = relationship(back_populates="recipes")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

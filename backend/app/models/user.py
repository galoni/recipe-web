from typing import Optional
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from datetime import datetime
from app.core.database import Base
from typing import List, TYPE_CHECKING

if TYPE_CHECKING:
    from .db import Recipe


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    full_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    hashed_password: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    auth_provider: Mapped[str] = mapped_column(String, default="email")
    provider_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    recipes: Mapped[List["Recipe"]] = relationship(back_populates="owner")

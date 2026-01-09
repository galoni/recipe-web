import uuid
from datetime import datetime
from typing import Optional

from app.core.database import Base
from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    token_jti: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)

    device_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    browser_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    browser_version: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    os_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    os_version: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    location_city: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    location_country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    last_active_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    revoked_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    user = relationship("User")


class SecurityEvent(Base):
    __tablename__ = "security_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    event_metadata: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    notification_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    user = relationship("User")

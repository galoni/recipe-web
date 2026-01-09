from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict


class SessionBase(BaseModel):
    device_type: Optional[str] = None
    browser_name: Optional[str] = None
    browser_version: Optional[str] = None
    os_name: Optional[str] = None
    os_version: Optional[str] = None
    ip_address: Optional[str] = None
    location_city: Optional[str] = None
    location_country: Optional[str] = None
    last_active_at: datetime


class Session(SessionBase):
    id: UUID
    is_current: bool = False

    model_config = ConfigDict(from_attributes=True)


class TwoFactorSetup(BaseModel):
    secret: str
    otpauth_url: str
    qr_code_base64: Optional[str] = None


class TwoFactorEnable(BaseModel):
    code: str
    secret: str


class SecurityEventBase(BaseModel):
    event_type: str
    created_at: datetime
    event_metadata: Optional[dict] = None


class SecurityEvent(SecurityEventBase):
    id: UUID

    model_config = ConfigDict(from_attributes=True)

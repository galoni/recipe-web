from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    full_name: str | None = None
    is_active: bool = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None


class UserInDB(UserBase):
    id: int
    auth_provider: str
    last_login_at: datetime | None = None
    last_login_ip: str | None = None
    is_2fa_enabled: bool = False
    security_notifications_enabled: bool = True

    model_config = ConfigDict(from_attributes=True)


class User(UserInDB):
    pass

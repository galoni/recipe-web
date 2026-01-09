from typing import Optional

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str | None = None
    token_type: str | None = None
    requires_2fa: bool = False
    challenge_token: str | None = None


class TokenData(BaseModel):
    id: Optional[int] = None
    email: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TwoFactorVerify(BaseModel):
    code: str
    challenge_token: str

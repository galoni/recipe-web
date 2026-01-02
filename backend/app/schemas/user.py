from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True


class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserInDB(UserBase):
    id: int
    auth_provider: str

    class Config:
        from_attributes = True


class User(UserInDB):
    pass

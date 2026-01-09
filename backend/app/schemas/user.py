from pydantic import BaseModel, EmailStr, ConfigDict


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

    model_config = ConfigDict(from_attributes=True)


class User(UserInDB):
    pass

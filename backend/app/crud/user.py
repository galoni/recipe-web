from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User
from app.core.security import get_password_hash, verify_password


class CRUDUser:
    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).filter(User.email == email))
        return result.scalars().first()

    async def create(
        self,
        db: AsyncSession,
        email: str,
        password: Optional[str] = None,
        full_name: Optional[str] = None,
        auth_provider: str = "email",
        provider_id: Optional[str] = None,
    ) -> User:
        hashed_password = get_password_hash(password) if password else None
        db_obj = User(
            email=email,
            full_name=full_name,
            hashed_password=hashed_password,
            auth_provider=auth_provider,
            provider_id=provider_id,
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def authenticate(
        self, db: AsyncSession, email: str, password: str
    ) -> Optional[User]:
        user = await self.get_by_email(db, email)
        if not user or not user.hashed_password:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user


user = CRUDUser()

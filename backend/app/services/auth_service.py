from datetime import timedelta
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.user import user as user_crud
from app.core.security import create_access_token
from app.core.config import settings
from app.core.logger import logger

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def authenticate_user(self, email: str, password: str):
        logger.info("Attempting authentication", extra={"props": {"email": email}})
        user = await user_crud.authenticate(self.db, email, password)
        if not user:
            logger.warning("Authentication failed", extra={"props": {"email": email}})
            return None
        return user

    async def register_new_user(self, email: str, password: str):
        existing = await user_crud.get_by_email(self.db, email)
        if existing:
            return None
        # Create user
        logger.info("Registering new user", extra={"props": {"email": email}})
        return await user_crud.create(self.db, email=email, password=password)

    def create_token_for_user(self, user_id: int):
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        return create_access_token(
            subject=user_id, expires_delta=access_token_expires
        )

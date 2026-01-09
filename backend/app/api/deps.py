from fastapi import Depends, HTTPException, status, Request
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.database import get_db
from app.models.user import User


async def get_current_user(
    request: Request, db: AsyncSession = Depends(get_db)
) -> User:
    """
    Get current user from JWT token in cookies.
    """
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    # Strip 'Bearer ' if present (some parts of the app might set it)
    if token.startswith("Bearer "):
        token = token.replace("Bearer ", "", 1)

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )

    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user


async def get_current_user_optional(
    request: Request, db: AsyncSession = Depends(get_db)
) -> User | None:
    """
    Get current user if token is present, otherwise return None.
    Does not raise 401.
    """
    token = request.cookies.get("access_token")
    if not token:
        return None

    if token.startswith("Bearer "):
        token = token.replace("Bearer ", "", 1)

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
            
        result = await db.execute(select(User).where(User.id == int(user_id)))
        return result.scalar_one_or_none()
    except (JWTError, ValueError):
        return None

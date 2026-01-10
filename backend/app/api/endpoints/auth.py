import secrets
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import (APIRouter, Depends, HTTPException, Request, Response,
                     status)
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.core.logger import logger
from app.schemas.auth import Token, TwoFactorVerify
from app.schemas.user import User, UserCreate
from app.services.auth_service import AuthService
from app.services.oauth import GoogleOAuthProvider

router = APIRouter()


@router.get("/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Get the current authenticated user.
    """
    return current_user


@router.post("/token", response_model=Token)
async def login_access_token(
    request: Request,
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    Sets HttpOnly cookie.
    """
    auth_service = AuthService(db)
    user = await auth_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if user.is_2fa_enabled:
        # Create a short-lived challenge token
        challenge_token = jwt.encode(
            {
                "sub": str(user.id),
                "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
                "type": "2fa_challenge",
            },
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM,
        )
        return {"requires_2fa": True, "challenge_token": challenge_token}

    access_token, jti = auth_service.create_token_for_user(user.id)

    # Create Session
    from app.services.security_service import SecurityService

    security_service = SecurityService(db)
    await security_service.create_session(
        user_id=user.id,
        token_jti=jti,
        user_agent=request.headers.get("user-agent", ""),
        ip_address=request.client.host if request.client else "unknown",
    )

    # Set Cookie
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/verify-2fa", response_model=Token)
async def verify_2fa(
    request: Request,
    response: Response,
    data: TwoFactorVerify,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Verify 2FA code and complete login.
    """
    import pyotp

    from app.models.user import User
    from app.services.security_service import SecurityService

    try:
        payload = jwt.decode(
            data.challenge_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        if payload.get("type") != "2fa_challenge":
            raise HTTPException(status_code=400, detail="Invalid challenge token")
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(
            status_code=400, detail="Invalid or expired challenge token"
        )

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or not user.is_2fa_enabled:
        raise HTTPException(status_code=400, detail="Invalid user or 2FA not enabled")

    # Verify TOTP
    totp = pyotp.TOTP(user.totp_secret)
    if not totp.verify(data.code):
        raise HTTPException(status_code=400, detail="Invalid verification code")

    auth_service = AuthService(db)
    access_token, jti = auth_service.create_token_for_user(user.id)

    # Create Session
    security_service = SecurityService(db)
    await security_service.create_session(
        user_id=user.id,
        token_jti=jti,
        user_agent=request.headers.get("user-agent", ""),
        ip_address=request.client.host if request.client else "unknown",
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/google/login")
def login_google(response: Response):
    provider = GoogleOAuthProvider()
    # Generate random state to prevent CSRF
    state = secrets.token_urlsafe(32)
    # Store state in cookie to verify later
    response.set_cookie(key="oauth_state", value=state, httponly=True, max_age=300)

    return RedirectResponse(url=provider.get_login_url(state=state))


@router.get("/google/callback")
async def google_callback(
    code: str,
    state: str,
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    provider = GoogleOAuthProvider()
    try:
        token_data = await provider.get_token(code)
    except Exception as e:
        logger.error(f"Google Token Exchange failed: {e}")
        raise HTTPException(status_code=400, detail="OAuth failure")

    try:
        user_info = await provider.get_user_info(token_data["access_token"])
    except Exception as e:
        logger.error(f"Google User Info failed: {e}")
        raise HTTPException(status_code=400, detail="OAuth info failure")

    email = user_info.get("email")
    google_id = user_info.get("sub")

    # Logic to Find or Create User
    from app.crud.user import user as user_crud

    existing_user = await user_crud.get_by_email(db, email)
    if not existing_user:
        # Auto-register
        existing_user = await user_crud.create(
            db, email=email, auth_provider="google", provider_id=google_id
        )

    if existing_user.is_2fa_enabled:
        # Create a short-lived challenge token
        challenge_token = jwt.encode(
            {
                "sub": str(existing_user.id),
                "exp": datetime.now(timezone.utc) + timedelta(minutes=5),
                "type": "2fa_challenge",
            },
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM,
        )
        return RedirectResponse(
            url=f"{settings.FRONTEND_URL}/login/2fa?token={challenge_token}"
        )

    # Create Session
    auth_service = AuthService(db)
    access_token, jti = auth_service.create_token_for_user(existing_user.id)

    from app.services.security_service import SecurityService

    security_service = SecurityService(db)
    await security_service.create_session(
        user_id=existing_user.id,
        token_jti=jti,
        user_agent=request.headers.get("user-agent", ""),
        ip_address=request.client.host if request.client else "unknown",
    )

    resp = RedirectResponse(url=f"{settings.FRONTEND_URL}/dashboard")
    resp.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return resp


@router.post("/register", response_model=User)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Register a new user with email and password.
    """
    auth_service = AuthService(db)
    user = await auth_service.register_new_user(
        user_in.email, user_in.password, user_in.full_name
    )
    if not user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists",
        )
    return user


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    db: AsyncSession = Depends(get_db),
):
    """
    Logout the user by clearing the cookies and revoking the session.
    """
    token = request.cookies.get("access_token")
    if token:
        if token.startswith("Bearer "):
            token = token.replace("Bearer ", "", 1)
        try:
            from jose import jwt

            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
            jti = payload.get("jti")
            if jti:
                from app.models.security import Session

                await db.execute(
                    update(Session)
                    .where(Session.token_jti == jti)
                    .values(revoked_at=datetime.now(timezone.utc))
                )
                await db.commit()
        except Exception:
            # Token might be expired or invalid, still clear cookie
            pass

    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=settings.ENVIRONMENT == "production",
        samesite="lax",
    )
    return {"status": "success", "message": "Logged out"}

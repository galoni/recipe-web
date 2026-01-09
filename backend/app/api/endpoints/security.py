import pyotp
import qrcode
import io
import base64
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.core.config import settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.security import Session, TwoFactorSetup, TwoFactorEnable
from app.services.security_service import SecurityService

router = APIRouter()


@router.get("/sessions", response_model=List[Session])
async def list_sessions(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    security_service = SecurityService(db)
    sessions = await security_service.get_active_sessions(current_user.id)

    # Get current session JTI from token
    token = request.cookies.get("access_token")
    current_jti = None
    if token:
        if token.startswith("Bearer "):
            token = token.replace("Bearer ", "", 1)
        try:
            from jose import jwt

            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
            current_jti = payload.get("jti")
        except:
            pass

    return [
        Session(
            id=s.id,
            user_id=s.user_id,
            device_type=s.device_type,
            browser_name=s.browser_name,
            browser_version=s.browser_version,
            os_name=s.os_name,
            os_version=s.os_version,
            ip_address=s.ip_address,
            location_city=s.location_city,
            location_country=s.location_country,
            last_active_at=s.last_active_at,
            created_at=s.created_at,
            is_current=s.token_jti == current_jti,
        )
        for s in sessions
    ]


@router.post("/sessions/{session_id}/revoke")
async def revoke_session(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    security_service = SecurityService(db)
    success = await security_service.revoke_session(current_user.id, session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": "success"}


@router.post("/sessions/revoke-others")
async def revoke_others(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    token = request.cookies.get("access_token")
    current_jti = None
    if token:
        if token.startswith("Bearer "):
            token = token.replace("Bearer ", "", 1)
        try:
            from jose import jwt

            payload = jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
            current_jti = payload.get("jti")
        except:
            pass

    if not current_jti:
        raise HTTPException(status_code=400, detail="Current session not found")

    security_service = SecurityService(db)
    await security_service.revoke_all_other_sessions(current_user.id, current_jti)
    return {"status": "success"}


@router.post("/2fa/setup", response_model=TwoFactorSetup)
async def setup_2fa(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.is_2fa_enabled:
        raise HTTPException(status_code=400, detail="2FA is already enabled")

    security_service = SecurityService(db)
    secret = await security_service.generate_2fa_secret(current_user.id)

    totp = pyotp.TOTP(secret)
    otpauth_url = totp.provisioning_uri(
        name=current_user.email, issuer_name=settings.TOTP_ISSUER
    )

    # Generate QR Code
    img = qrcode.make(otpauth_url)
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    qr_code_base64 = base64.b64encode(buffered.getvalue()).decode()

    return {
        "secret": secret,
        "otpauth_url": otpauth_url,
        "qr_code_base64": f"data:image/png;base64,{qr_code_base64}",
    }


@router.post("/2fa/enable")
async def enable_2fa(
    data: TwoFactorEnable,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.is_2fa_enabled:
        raise HTTPException(status_code=400, detail="2FA is already enabled")

    totp = pyotp.TOTP(data.secret)
    if not totp.verify(data.code):
        raise HTTPException(status_code=400, detail="Invalid verification code")

    # Generate backup codes
    import secrets

    backup_codes = [secrets.token_hex(4).upper() for _ in range(10)]

    security_service = SecurityService(db)
    await security_service.enable_2fa(current_user.id, data.secret, backup_codes)

    return {"status": "success", "backup_codes": backup_codes}


@router.post("/2fa/disable")
async def disable_2fa(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not current_user.is_2fa_enabled:
        raise HTTPException(status_code=400, detail="2FA is not enabled")

    security_service = SecurityService(db)
    await security_service.disable_2fa(current_user.id)

    return {"status": "success"}


@router.post("/notifications/toggle")
async def toggle_notifications(
    enabled: bool = Query(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await db.execute(
        update(User)
        .where(User.id == current_user.id)
        .values(security_notifications_enabled=enabled)
    )
    await db.commit()
    return {"status": "success", "enabled": enabled}

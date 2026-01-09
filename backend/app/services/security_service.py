import pyotp
import uuid
from datetime import datetime, timezone
from typing import List, Optional

from sqlalchemy import select, update, func, and_
from sqlalchemy.ext.asyncio import AsyncSession
from ua_parser import user_agent_parser

from app.models.security import Session, SecurityEvent
from app.models.user import User
from app.services.email_service import EmailService


class SecurityService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_session(
        self,
        user_id: int,
        token_jti: str,
        user_agent: str,
        ip_address: str,
    ) -> Session:
        # Parse user agent
        ua_result = user_agent_parser.Parse(user_agent)

        device_type = "Desktop"
        if ua_result.get("device", {}).get("family") != "Other":
            device_type = ua_result["device"]["family"]
        elif "Mobile" in user_agent:
            device_type = "Mobile"

        from app.services.geoip import GeoIPService

        city, country = await GeoIPService.get_location(ip_address)

        session = Session(
            user_id=user_id,
            token_jti=token_jti,
            device_type=device_type,
            browser_name=ua_result["user_agent"]["family"],
            browser_version=ua_result["user_agent"]["major"],
            os_name=ua_result["os"]["family"],
            os_version=ua_result["os"]["major"],
            ip_address=ip_address,
            location_city=city,
            location_country=country,
        )
        self.db.add(session)

        # Log security event
        event = SecurityEvent(
            user_id=user_id,
            event_type="login",
            event_metadata={
                "ip": ip_address,
                "device": device_type,
                "browser": ua_result["user_agent"]["family"],
            },
        )
        self.db.add(event)

        # Update user's last login
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(last_login_at=datetime.now(timezone.utc), last_login_ip=ip_address)
        )

        await self.db.commit()

        # Check for new device and send notification
        # For simplicity, we check if there are any other active sessions with the same IP and browser
        # If not, we consider it a "new device" alert
        query = select(func.count(Session.id)).where(
            and_(
                Session.user_id == user_id,
                Session.ip_address == ip_address,
                Session.browser_name == ua_result["user_agent"]["family"],
                Session.token_jti != token_jti,
                Session.revoked_at == None,
            )
        )
        result = await self.db.execute(query)
        count = result.scalar()

        if count == 0:
            # Fetch user email
            user_result = await self.db.execute(select(User).where(User.id == user_id))
            user = user_result.scalar_one_or_none()
            if user and user.security_notifications_enabled:
                device_info = f"{ua_result['user_agent']['family']} on {ua_result['os']['family']}"
                location = f"{city or 'Unknown'}, {country or 'Unknown'}"
                await EmailService.send_new_device_login_email(
                    email_to=user.email,
                    device_info=device_info,
                    location=location,
                    ip_address=ip_address,
                    timestamp=datetime.now(timezone.utc).strftime(
                        "%Y-%m-%d %H:%M:%S UTC"
                    ),
                )

        return session

    async def get_active_sessions(self, user_id: int) -> List[Session]:
        result = await self.db.execute(
            select(Session)
            .where(Session.user_id == user_id, Session.revoked_at == None)
            .order_by(Session.last_active_at.desc())
        )
        return list(result.scalars().all())

    async def revoke_session(self, user_id: int, session_id: uuid.UUID) -> bool:
        result = await self.db.execute(
            update(Session)
            .where(Session.id == session_id, Session.user_id == user_id)
            .values(revoked_at=datetime.now(timezone.utc))
        )
        await self.db.commit()
        return result.rowcount > 0

    async def revoke_all_other_sessions(self, user_id: int, current_jti: str):
        await self.db.execute(
            update(Session)
            .where(Session.user_id == user_id, Session.token_jti != current_jti)
            .values(revoked_at=datetime.now(timezone.utc))
        )
        await self.db.commit()

    async def generate_2fa_secret(self, user_id: int) -> str:
        secret = pyotp.random_base32()
        # We don't save it yet; we wait for verification
        return secret

    async def enable_2fa(self, user_id: int, secret: str, backup_codes: List[str]):
        from passlib.context import CryptContext

        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        hashed_codes = [pwd_context.hash(code) for code in backup_codes]

        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(
                totp_secret=secret,
                is_2fa_enabled=True,
                backup_codes_hashed=hashed_codes,
            )
        )

        event = SecurityEvent(user_id=user_id, event_type="2fa_enabled")
        self.db.add(event)
        await self.db.commit()

        # Send notification
        user_result = await self.db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        if user and user.security_notifications_enabled:
            await EmailService.send_2fa_enabled_email(user.email)

    async def disable_2fa(self, user_id: int):
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(totp_secret=None, is_2fa_enabled=False, backup_codes_hashed=None)
        )

        event = SecurityEvent(user_id=user_id, event_type="2fa_disabled")
        self.db.add(event)
        await self.db.commit()

        # Send notification
        user_result = await self.db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        if user and user.security_notifications_enabled:
            await EmailService.send_2fa_disabled_email(user.email)

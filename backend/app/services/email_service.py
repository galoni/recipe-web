from typing import Any, Dict, Optional
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    async def send_email(
        email_to: str, subject: str, template_name: str, template_data: Dict[str, Any]
    ) -> bool:
        """
        Sends an email using the configured SMTP server.
        In development, it just logs the email.
        """
        logger.info(f"Sending security email to {email_to}: {subject}")
        logger.info(f"Template: {template_name}, Data: {template_data}")

        # In a real implementation, you'd use a library like fast-mail or aiyomail
        # For now, we simulate success and log the "content"
        print(f"\n--- SECURITY EMAIL SENT ---")
        print(f"TO: {email_to}")
        print(f"SUBJECT: {subject}")
        print(f"TEMPLATE: {template_name}")
        print(f"DATA: {template_data}")
        print(f"--- END EMAIL ---\n")

        return True

    @staticmethod
    async def send_new_device_login_email(
        email_to: str, device_info: str, location: str, ip_address: str, timestamp: str
    ):
        await EmailService.send_email(
            email_to=email_to,
            subject="Security Alert: New sign-in to your ChefStream account",
            template_name="new_device_login",
            template_data={
                "device_info": device_info,
                "location": location,
                "ip_address": ip_address,
                "timestamp": timestamp,
            },
        )

    @staticmethod
    async def send_2fa_enabled_email(email_to: str):
        await EmailService.send_email(
            email_to=email_to,
            subject="Security Update: Two-Factor Authentication Enabled",
            template_name="2fa_enabled",
            template_data={},
        )

    @staticmethod
    async def send_2fa_disabled_email(email_to: str):
        await EmailService.send_email(
            email_to=email_to,
            subject="Security Alert: Two-Factor Authentication Disabled",
            template_name="2fa_disabled",
            template_data={},
        )

from unittest.mock import AsyncMock, patch

import pytest

from app.services.email_service import EmailService


@pytest.mark.asyncio
async def test_send_new_device_login_email():
    with patch.object(EmailService, "send_email", new_callable=AsyncMock) as mock_send:
        await EmailService.send_new_device_login_email(
            "test@example.com",
            "Chrome on MacOS",
            "New York, US",
            "127.0.0.1",
            "2025-01-01",
        )

        mock_send.assert_called_once()
        call_args = mock_send.call_args[1]
        assert call_args["email_to"] == "test@example.com"
        assert call_args["template_name"] == "new_device_login"
        assert call_args["template_data"]["device_info"] == "Chrome on MacOS"


@pytest.mark.asyncio
async def test_send_2fa_enabled_email():
    with patch.object(EmailService, "send_email", new_callable=AsyncMock) as mock_send:
        await EmailService.send_2fa_enabled_email("test@example.com")

        mock_send.assert_called_once()
        assert mock_send.call_args[1]["template_name"] == "2fa_enabled"


@pytest.mark.asyncio
async def test_send_2fa_disabled_email():
    with patch.object(EmailService, "send_email", new_callable=AsyncMock) as mock_send:
        await EmailService.send_2fa_disabled_email("test@example.com")

        mock_send.assert_called_once()
        assert mock_send.call_args[1]["template_name"] == "2fa_disabled"


@pytest.mark.asyncio
async def test_send_email_base():
    # Test the base method (just logs/prints currently)
    with patch("app.services.email_service.logger") as mock_logger:
        res = await EmailService.send_email(
            "test@example.com", "Subject", "template", {}
        )
        assert res is True
        mock_logger.info.assert_called()

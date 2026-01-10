from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.models.user import User
from app.services.security_service import SecurityService


@pytest.fixture
def mock_db():
    db = AsyncMock()
    return db


@pytest.mark.asyncio
async def test_create_session(mock_db):
    service = SecurityService(mock_db)

    with patch("app.services.security_service.GeoIPService") as MockGeoIP:
        MockGeoIP.get_location = AsyncMock(return_value=("TestCity", "TestCountry"))

        with patch("app.services.security_service.EmailService") as MockEmail:
            # Mock the internal async methods
            MockEmail.send_new_device_login_email = AsyncMock()

            # 1. Update User
            mock_update_result = MagicMock()

            # 2. Count Check
            mock_count_result = MagicMock()
            mock_count_result.scalar.return_value = 0

            # 3. User Fetch
            mock_user = User(
                id=1, email="test@example.com", security_notifications_enabled=True
            )
            mock_user_result = MagicMock()
            mock_user_result.scalar_one_or_none.return_value = mock_user

            mock_db.execute.side_effect = [
                mock_update_result,
                mock_count_result,
                mock_user_result,
            ]

            session = await service.create_session(
                user_id=1,
                token_jti="jti_123",
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                ip_address="127.0.0.1",
            )

            assert session.user_id == 1
            assert session.token_jti == "jti_123"
            assert session.location_city == "TestCity"

            MockEmail.send_new_device_login_email.assert_called_once()
            assert mock_db.add.call_count == 2


@pytest.mark.asyncio
async def test_create_session_existing_device(mock_db):
    service = SecurityService(mock_db)

    with patch("app.services.security_service.GeoIPService") as MockGeoIP:
        MockGeoIP.get_location = AsyncMock(return_value=("TestCity", "TestCountry"))

        with patch("app.services.security_service.EmailService") as MockEmail:
            MockEmail.send_new_device_login_email = AsyncMock()

            # 1. Update
            mock_update_result = MagicMock()

            # 2. Count Check -> returns 1
            mock_count_result = MagicMock()
            mock_count_result.scalar.return_value = 1

            mock_db.execute.side_effect = [mock_update_result, mock_count_result]

            await service.create_session(
                user_id=1,
                token_jti="jti_123",
                user_agent="Mozilla/5.0",
                ip_address="127.0.0.1",
            )

            MockEmail.send_new_device_login_email.assert_not_called()


@pytest.mark.asyncio
async def test_revoke_session(mock_db):
    service = SecurityService(mock_db)

    mock_result = MagicMock()
    mock_result.rowcount = 1
    mock_db.execute.return_value = mock_result

    success = await service.revoke_session(1, "sess_id")

    assert success is True
    assert mock_db.commit.called


@pytest.mark.asyncio
async def test_enable_2fa(mock_db):
    service = SecurityService(mock_db)

    with patch("app.services.security_service.EmailService") as MockEmail:
        MockEmail.send_2fa_enabled_email = AsyncMock()

        mock_user = User(
            id=1, email="test@example.com", security_notifications_enabled=True
        )
        mock_user_result = MagicMock()
        mock_user_result.scalar_one_or_none.return_value = mock_user

        # 1. Update
        mock_update_result = MagicMock()

        # 2. Select User
        mock_db.execute.side_effect = [mock_update_result, mock_user_result]

        await service.enable_2fa(1, "secret", ["code1", "code2"])

        MockEmail.send_2fa_enabled_email.assert_called_with("test@example.com")
        # Check event log
        # mock_db.add is called for SecurityEvent
        # The first call in enable_2fa is db.add(event)
        args, _ = mock_db.add.call_args
        assert args[0].event_type == "2fa_enabled"


@pytest.mark.asyncio
async def test_disable_2fa(mock_db):
    service = SecurityService(mock_db)

    with patch("app.services.security_service.EmailService") as MockEmail:
        MockEmail.send_2fa_disabled_email = AsyncMock()

        mock_user = User(
            id=1, email="test@example.com", security_notifications_enabled=True
        )
        mock_user_result = MagicMock()
        mock_user_result.scalar_one_or_none.return_value = mock_user

        mock_db.execute.side_effect = [
            MagicMock(),  # Update
            mock_user_result,  # Select
        ]

        await service.disable_2fa(1)

        MockEmail.send_2fa_disabled_email.assert_called_with("test@example.com")
        assert mock_db.add.called

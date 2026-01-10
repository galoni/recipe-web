from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest

from app.api.endpoints.security import router
from app.models.user import User


@pytest.fixture
def mock_user():
    return User(id=1, email="test@example.com", is_2fa_enabled=False)


@pytest.fixture
def mock_db():
    return AsyncMock()


@pytest.mark.asyncio
async def test_list_sessions_success(mock_db, mock_user):
    # Setup mocks
    mock_sessions = [
        MagicMock(
            id=uuid4(),
            user_id=1,
            device_type="Desktop",
            browser_name="Chrome",
            browser_version="120",
            os_name="Mac OS X",
            os_version="10.15.7",
            ip_address="127.0.0.1",
            location_city="London",
            location_country="UK",
            last_active_at=datetime.now(timezone.utc),
            created_at=datetime.now(timezone.utc),
            token_jti="jti_123",
        )
    ]

    with patch("app.api.endpoints.security.SecurityService") as MockService:
        service_instance = MockService.return_value
        service_instance.get_active_sessions = AsyncMock(return_value=mock_sessions)

        # We need to simulate the request and dependencies
        from fastapi import FastAPI
        from httpx import ASGITransport, AsyncClient

        app = FastAPI()
        app.include_router(router)

        # Override dependency
        app.dependency_overrides[User] = lambda: mock_user
        # Actually security endpoints use get_current_user
        from app.api.deps import get_current_user, get_db

        app.dependency_overrides[get_current_user] = lambda: mock_user
        app.dependency_overrides[get_db] = lambda: mock_db

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            # Set cookie for current_jti check
            ac.cookies.set("access_token", "Bearer test_token")

            with patch("jose.jwt.decode", return_value={"jti": "jti_123"}):
                response = await ac.get("/sessions")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["is_current"] is True


@pytest.mark.asyncio
async def test_revoke_session_success(mock_db, mock_user):
    session_id = uuid4()

    with patch("app.api.endpoints.security.SecurityService") as MockService:
        service_instance = MockService.return_value
        service_instance.revoke_session = AsyncMock(return_value=True)

        from fastapi import FastAPI
        from httpx import ASGITransport, AsyncClient

        from app.api.deps import get_current_user, get_db

        app = FastAPI()
        app.include_router(router)
        app.dependency_overrides[get_current_user] = lambda: mock_user
        app.dependency_overrides[get_db] = lambda: mock_db

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            response = await ac.post(f"/sessions/{session_id}/revoke")

    assert response.status_code == 200
    assert response.json() == {"status": "success"}


@pytest.mark.asyncio
async def test_setup_2fa_success(mock_db, mock_user):
    with patch("app.api.endpoints.security.SecurityService") as MockService:
        service_instance = MockService.return_value
        service_instance.generate_2fa_secret = AsyncMock(
            return_value="K7IUC2LMN5RWA3DP"
        )

        from fastapi import FastAPI
        from httpx import ASGITransport, AsyncClient

        from app.api.deps import get_current_user, get_db

        app = FastAPI()
        app.include_router(router)
        app.dependency_overrides[get_current_user] = lambda: mock_user
        app.dependency_overrides[get_db] = lambda: mock_db

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            response = await ac.post("/2fa/setup")

    assert response.status_code == 200
    data = response.json()
    assert "secret" in data
    assert "qr_code_base64" in data


@pytest.mark.asyncio
async def test_enable_2fa_success(mock_db, mock_user):
    with patch("app.api.endpoints.security.SecurityService") as MockService:
        service_instance = MockService.return_value
        service_instance.enable_2fa = AsyncMock()

        import pyotp
        from fastapi import FastAPI
        from httpx import ASGITransport, AsyncClient

        from app.api.deps import get_current_user, get_db

        # Generate a valid code
        secret = "K7IUC2LMN5RWA3DP"
        totp = pyotp.TOTP(secret)
        code = totp.now()

        app = FastAPI()
        app.include_router(router)
        app.dependency_overrides[get_current_user] = lambda: mock_user
        app.dependency_overrides[get_db] = lambda: mock_db

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            response = await ac.post(
                "/2fa/enable", json={"secret": secret, "code": code}
            )

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert "backup_codes" in response.json()


@pytest.mark.asyncio
async def test_disable_2fa_success(mock_db):
    # User with 2FA enabled
    user = User(id=1, email="test@example.com", is_2fa_enabled=True)

    with patch("app.api.endpoints.security.SecurityService") as MockService:
        service_instance = MockService.return_value
        service_instance.disable_2fa = AsyncMock()

        from fastapi import FastAPI
        from httpx import ASGITransport, AsyncClient

        from app.api.deps import get_current_user, get_db

        app = FastAPI()
        app.include_router(router)
        app.dependency_overrides[get_current_user] = lambda: user
        app.dependency_overrides[get_db] = lambda: mock_db

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            response = await ac.post("/2fa/disable")

    assert response.status_code == 200
    assert response.json() == {"status": "success"}


@pytest.mark.asyncio
async def test_toggle_notifications_success(mock_db, mock_user):
    from fastapi import FastAPI
    from httpx import ASGITransport, AsyncClient

    from app.api.deps import get_current_user, get_db

    app = FastAPI()
    app.include_router(router)
    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_db] = lambda: mock_db

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.post("/notifications/toggle", params={"enabled": "true"})

    assert response.status_code == 200
    assert response.json() == {"status": "success", "enabled": True}
    assert mock_db.execute.called
    assert mock_db.commit.called

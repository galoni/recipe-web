import pytest
from unittest.mock import AsyncMock, patch
from app.services.auth_service import AuthService

@pytest.mark.asyncio
async def test_authenticate_user_success():
    mock_db = AsyncMock()
    service = AuthService(mock_db)
    
    with patch("app.services.auth_service.user_crud.authenticate", new_callable=AsyncMock) as mock_auth:
        mock_auth.return_value = {"id": 1, "email": "test@example.com"}
        user = await service.authenticate_user("test@example.com", "password")
        assert user is not None
        assert user["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_authenticate_user_fail():
    mock_db = AsyncMock()
    service = AuthService(mock_db)
    
    with patch("app.services.auth_service.user_crud.authenticate", new_callable=AsyncMock) as mock_auth:
        mock_auth.return_value = None
        user = await service.authenticate_user("test@example.com", "wrong")
        assert user is None

@pytest.mark.asyncio
async def test_register_new_user_success():
    mock_db = AsyncMock()
    service = AuthService(mock_db)
    
    with patch("app.services.auth_service.user_crud.get_by_email", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = None
        with patch("app.services.auth_service.user_crud.create", new_callable=AsyncMock) as mock_create:
            mock_create.return_value = {"id": 1, "email": "new@example.com"}
            user = await service.register_new_user("new@example.com", "password")
            assert user is not None
            assert user["email"] == "new@example.com"

@pytest.mark.asyncio
async def test_register_new_user_exists():
    mock_db = AsyncMock()
    service = AuthService(mock_db)
    
    with patch("app.services.auth_service.user_crud.get_by_email", new_callable=AsyncMock) as mock_get:
        mock_get.return_value = {"id": 1}
        user = await service.register_new_user("exists@example.com", "password")
        assert user is None

def test_create_token_for_user():
    service = AuthService(AsyncMock())
    token = service.create_token_for_user(1)
    assert token is not None
    assert isinstance(token, str)

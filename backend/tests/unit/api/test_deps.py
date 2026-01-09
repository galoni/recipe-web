from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from app.api.deps import get_current_user, get_current_user_optional
from app.core.config import settings
from app.models.user import User
from fastapi import HTTPException, Request, status
from jose import JWTError, jwt


@pytest.fixture
def mock_request():
    request = MagicMock(spec=Request)
    request.cookies = {}
    return request


@pytest.fixture
def mock_db():
    mock = AsyncMock()
    return mock


@pytest.mark.asyncio
async def test_get_current_user_no_token(mock_request, mock_db):
    mock_request.cookies = {}

    with pytest.raises(HTTPException) as exc:
        await get_current_user(request=mock_request, db=mock_db)

    assert exc.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert exc.value.detail == "Not authenticated"


@pytest.mark.asyncio
async def test_get_current_user_invalid_token(mock_request, mock_db):
    mock_request.cookies = {"access_token": "invalid"}

    with patch("jose.jwt.decode", side_effect=JWTError):
        with pytest.raises(HTTPException) as exc:
            await get_current_user(request=mock_request, db=mock_db)

    assert exc.value.status_code == status.HTTP_401_UNAUTHORIZED
    assert exc.value.detail == "Could not validate credentials"


@pytest.mark.asyncio
async def test_get_current_user_user_not_found(mock_request, mock_db):
    mock_request.cookies = {"access_token": "valid_token"}

    # Mock JWT decode
    with patch("jose.jwt.decode", return_value={"sub": "123"}):
        # Mock DB returning None
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = None
        mock_db.execute.return_value = mock_result

        with pytest.raises(HTTPException) as exc:
            await get_current_user(request=mock_request, db=mock_db)

    assert exc.value.status_code == 404
    assert exc.value.detail == "User not found"


@pytest.mark.asyncio
async def test_get_current_user_success(mock_request, mock_db):
    mock_request.cookies = {"access_token": "valid_token"}

    # Mock JWT decode
    with patch("jose.jwt.decode", return_value={"sub": "123"}):
        # Mock DB returning User
        mock_user = MagicMock()
        mock_user.id = 123
        mock_user.email = "test@example.com"
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_user
        mock_db.execute.return_value = mock_result

        user = await get_current_user(request=mock_request, db=mock_db)

    assert user == mock_user
    mock_db.execute.assert_called()


@pytest.mark.asyncio
async def test_get_current_user_bearer_prefix(mock_request, mock_db):
    mock_request.cookies = {"access_token": "Bearer valid_token"}

    with patch("jose.jwt.decode", return_value={"sub": "123"}):
        mock_user = MagicMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_user
        mock_db.execute.return_value = mock_result

        user = await get_current_user(request=mock_request, db=mock_db)

    assert user == mock_user


@pytest.mark.asyncio
async def test_get_current_user_optional_no_token(mock_request, mock_db):
    mock_request.cookies = {}
    user = await get_current_user_optional(request=mock_request, db=mock_db)
    assert user is None


@pytest.mark.asyncio
async def test_get_current_user_optional_success(mock_request, mock_db):
    mock_request.cookies = {"access_token": "valid_token"}

    with patch("jose.jwt.decode", return_value={"sub": "123"}):
        mock_user = MagicMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_user
        mock_db.execute.return_value = mock_result

        user = await get_current_user_optional(request=mock_request, db=mock_db)

    assert user == mock_user


@pytest.mark.asyncio
async def test_get_current_user_optional_invalid_token(mock_request, mock_db):
    mock_request.cookies = {"access_token": "invalid"}

    with patch("jose.jwt.decode", side_effect=JWTError):
        user = await get_current_user_optional(request=mock_request, db=mock_db)

    assert user is None


@pytest.mark.asyncio
async def test_get_current_user_optional_bearer_prefix(mock_request, mock_db):
    mock_request.cookies = {"access_token": "Bearer valid_token"}

    with patch("jose.jwt.decode", return_value={"sub": "123"}):
        mock_user = MagicMock()
        mock_result = MagicMock()
        mock_result.scalar_one_or_none.return_value = mock_user
        mock_db.execute.return_value = mock_result

        user = await get_current_user_optional(request=mock_request, db=mock_db)

    assert user == mock_user


@pytest.mark.asyncio
async def test_get_current_user_optional_no_sub(mock_request, mock_db):
    mock_request.cookies = {"access_token": "valid_token"}

    with patch("jose.jwt.decode", return_value={}):
        user = await get_current_user_optional(request=mock_request, db=mock_db)

    assert user is None

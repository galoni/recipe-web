from unittest.mock import AsyncMock, MagicMock

import pytest
from app.core.security import get_password_hash
from app.crud.user import user as crud_user
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.mark.asyncio
async def test_get_user_by_email():
    db = MagicMock(spec=AsyncSession)
    db.execute = AsyncMock()
    email = "test@example.com"
    mock_user = User(email=email)

    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = mock_user
    db.execute.return_value = mock_result

    user = await crud_user.get_by_email(db, email)
    assert user.email == email
    db.execute.assert_called_once()


@pytest.mark.asyncio
async def test_create_user():
    db = MagicMock(spec=AsyncSession)
    db.commit = AsyncMock()
    db.refresh = AsyncMock()
    email = "new@example.com"
    password = "password123"

    user = await crud_user.create(db, email=email, password=password)

    assert user.email == email
    assert user.hashed_password is not None
    db.add.assert_called_once()
    db.commit.assert_called_once()
    db.refresh.assert_called_once()


@pytest.mark.asyncio
async def test_authenticate_user_success():
    db = MagicMock(spec=AsyncSession)
    db.execute = AsyncMock()
    email = "auth@example.com"
    password = "valid_password"
    hashed_password = get_password_hash(password)
    mock_user = User(email=email, hashed_password=hashed_password)

    # Mock get_by_email
    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = mock_user
    db.execute.return_value = mock_result

    authenticated_user = await crud_user.authenticate(db, email, password)
    assert authenticated_user is not None
    assert authenticated_user.email == email


@pytest.mark.asyncio
async def test_authenticate_user_failure():
    db = MagicMock(spec=AsyncSession)
    db.execute = AsyncMock()
    email = "fail@example.com"
    password = "wrong_password"
    hashed_password = get_password_hash("correct_password")
    mock_user = User(email=email, hashed_password=hashed_password)

    mock_result = MagicMock()
    mock_result.scalars.return_value.first.return_value = mock_user
    db.execute.return_value = mock_result

    authenticated_user = await crud_user.authenticate(db, email, password)
    assert authenticated_user is None

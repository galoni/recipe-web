import pytest
from datetime import timedelta
from jose import jwt
from app.core.security import create_access_token, verify_password, get_password_hash
from app.core.config import settings


def test_password_hashing():
    password = "secret_password"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrong_password", hashed) is False


def test_create_access_token():
    subject = "test_user_id"
    token = create_access_token(subject)
    assert isinstance(token, str)

    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload["sub"] == subject
    assert "exp" in payload


def test_create_access_token_with_delta():
    subject = "test_user_id"
    expires_delta = timedelta(minutes=10)
    token = create_access_token(subject, expires_delta=expires_delta)
    assert isinstance(token, str)

    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    assert payload["sub"] == subject

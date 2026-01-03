import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock, AsyncMock
from app.main import app
from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
import uuid
from datetime import datetime

client = TestClient(app)

# Mocked user and session
mock_user = User(id=1, email="test@example.com")
mock_session = AsyncMock()
mock_session.add = MagicMock() # add() is synchronous in AsyncSession


async def mock_get_current_user():
    return mock_user

async def mock_get_db():
    yield mock_session

@pytest.fixture
def api_overrides():
    app.dependency_overrides[get_current_user] = mock_get_current_user
    app.dependency_overrides[get_db] = mock_get_db
    yield
    app.dependency_overrides.clear()
    mock_session.reset_mock()

def test_read_recipes_contract(api_overrides):
    # Mocking the DB execute result
    mock_recipe_db = MagicMock()
    mock_recipe_db.id = uuid.uuid4()
    mock_recipe_db.data = {
        "title": "Test Recipe",
        "description": "Delicious",
        "video_url": "https://youtube.com/watch?v=123",
        "ingredients": [{"item": "Tomato", "quantity": "2", "unit": "pcs"}],
        "steps": [{"step_number": 1, "instruction": "Chop tomato"}],
        "dietary_tags": ["vegan"]
    }
    mock_recipe_db.created_at = datetime.now()

    mock_result = MagicMock()
    # scalars().all() -> returns the list of DB models
    mock_result.scalars.return_value.all.return_value = [mock_recipe_db]
    mock_session.execute.return_value = mock_result

    response = client.get("/api/v1/recipes/")
    
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Test Recipe"

def test_delete_recipe_contract(api_overrides):
    recipe_id = uuid.uuid4()
    mock_recipe_db = MagicMock()
    mock_recipe_db.id = recipe_id

    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = mock_recipe_db
    mock_session.execute.return_value = mock_result

    response = client.delete(f"/api/v1/recipes/{recipe_id}")
    
    assert response.status_code == 204
    mock_session.delete.assert_called_once()
    mock_session.commit.assert_called_once()

def test_delete_recipe_not_found_contract(api_overrides):
    recipe_id = uuid.uuid4()

    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_session.execute.return_value = mock_result

    response = client.delete(f"/api/v1/recipes/{recipe_id}")
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Recipe not found or not owned by user"

def test_create_recipe_contract(api_overrides):
    recipe_data = {
        "title": "New Recipe",
        "description": "Tasty",
        "video_url": "https://youtube.com/watch?v=new",
        "ingredients": [{"item": "Apple", "quantity": "1"}],
        "steps": [{"step_number": 1, "instruction": "Eat apple"}],
        "dietary_tags": []
    }

    mock_session.commit = AsyncMock()
    
    async def side_effect_refresh(obj):
        obj.created_at = datetime.now()
    mock_session.refresh = AsyncMock(side_effect=side_effect_refresh)

    response = client.post("/api/v1/recipes/", json=recipe_data)

    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "New Recipe"
    assert "id" in data
    mock_session.add.assert_called_once()
    mock_session.commit.assert_called_once()

def test_create_recipe_database_error_contract(api_overrides):
    recipe_data = {
        "title": "Error Recipe",
        "video_url": "https://youtube.com/watch?v=err",
        "ingredients": [],
        "steps": []
    }

    mock_session.commit.side_effect = Exception("DB Fail")

    response = client.post("/api/v1/recipes/", json=recipe_data)
    
    assert response.status_code == 500
    assert "Database error" in response.json()["detail"]
    mock_session.rollback.assert_called_once()

def test_read_recipes_database_error_contract(api_overrides):
    mock_session.execute.side_effect = Exception("DB Error")

    response = client.get("/api/v1/recipes/")
    
    assert response.status_code == 500
    assert "DB Error" in response.json()["detail"]

def test_delete_recipe_database_error_contract(api_overrides):
    recipe_id = uuid.uuid4()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = MagicMock() # Found it
    mock_session.execute.return_value = mock_result
    mock_session.commit.side_effect = Exception("Delete Fail")

    response = client.delete(f"/api/v1/recipes/{recipe_id}")
    
    assert response.status_code == 500
    mock_session.rollback.assert_called_once()


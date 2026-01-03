from unittest.mock import AsyncMock, MagicMock
import uuid
from datetime import datetime

import pytest
from app.api.endpoints.recipes import create_recipe, delete_recipe, read_recipes
from app.schemas.recipe import RecipeCreate


@pytest.fixture
def mock_db():
    mock = AsyncMock()
    mock.commit = AsyncMock()
    mock.refresh = AsyncMock()
    mock.rollback = AsyncMock()
    mock.delete = AsyncMock()
    return mock


@pytest.fixture
def mock_user():
    user = MagicMock()
    user.id = uuid.uuid4()
    return user


@pytest.fixture
def recipe_create_data():
    return RecipeCreate(
        title="Test Recipe",
        description="A test recipe",
        ingredients=["Ingredient 1", "Ingredient 2"],
        steps=["Step 1", "Step 2"],
        time="30 min",
        servings="2",
        thumbnail_url="http://example.com/image.jpg",
        video_url="http://youtube.com/watch?v=123",
    )


@pytest.mark.asyncio
async def test_create_recipe(mock_db, mock_user, recipe_create_data):
    # Act
    result = await create_recipe(
        recipe=recipe_create_data, db=mock_db, current_user=mock_user
    )

    # Assert
    assert result.title == recipe_create_data.title
    assert result.video_url == recipe_create_data.video_url
    assert mock_db.add.called
    assert mock_db.commit.called
    assert mock_db.refresh.called


@pytest.mark.asyncio
async def test_read_recipes(mock_db, mock_user):
    # Setup
    mock_result = MagicMock()
    mock_recipe_model = MagicMock()
    mock_recipe_model.id = uuid.uuid4()
    mock_recipe_model.created_at = datetime.now()
    # Populate .data with dict that matches schema
    mock_recipe_model.data = {
        "title": "Test",
        "video_url": "url",
        "description": "desc",
        "ingredients": [],
        "steps": [],
        "time": "1m",
        "servings": "1",
        "thumbnail_url": "thumb",
    }

    # Configure scalars().all() behavior
    mock_result.scalars.return_value.all.return_value = [mock_recipe_model]
    mock_db.execute.return_value = mock_result

    # Act
    results = await read_recipes(skip=0, limit=10, db=mock_db, current_user=mock_user)

    # Assert
    assert len(results) == 1
    assert results[0].title == "Test"
    assert mock_db.execute.called


@pytest.mark.asyncio
async def test_delete_recipe(mock_db, mock_user):
    # Setup
    recipe_id = uuid.uuid4()
    mock_result = MagicMock()
    mock_recipe_model = MagicMock()

    # Configure scalar_one_or_none
    mock_result.scalar_one_or_none.return_value = mock_recipe_model
    mock_db.execute.return_value = mock_result

    # Act
    await delete_recipe(recipe_id=recipe_id, db=mock_db, current_user=mock_user)

    # Assert
    assert mock_db.delete.called_with(mock_recipe_model)
    assert mock_db.commit.called

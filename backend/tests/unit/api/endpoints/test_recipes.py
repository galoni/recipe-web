from unittest.mock import AsyncMock, MagicMock
import uuid
from datetime import datetime

import pytest
from app.api.endpoints.recipes import (
    create_recipe,
    delete_recipe,
    read_recipes,
    read_recipe,
)
from app.schemas.recipe import RecipeCreate


@pytest.fixture
def mock_db():
    mock = AsyncMock()
    mock.add = MagicMock()  # add is synchronous
    mock.commit = AsyncMock()
    mock.rollback = AsyncMock()
    mock.delete = AsyncMock()

    async def mock_refresh(instance):
        instance.created_at = datetime.now()
        instance.id = (
            uuid.uuid4()
        )  # Ensure ID is also present if needed (though passed in init usually)

    mock.refresh = AsyncMock(side_effect=mock_refresh)
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
        video_url="http://youtube.com/watch?v=123",
        thumbnail_url="http://example.com/image.jpg",
        servings=2,
        prep_time_minutes=30,
        cook_time_minutes=15,
        ingredients=[
            {"item": "Ingredient 1", "quantity": "1", "unit": "cup"},
            {"item": "Ingredient 2", "quantity": "2", "unit": "tbsp"},
        ],
        steps=[
            {"step_number": 1, "instruction": "Step 1 instruction"},
            {"step_number": 2, "instruction": "Step 2 instruction"},
        ],
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
    mock_db.add.assert_called()
    mock_db.commit.assert_called()
    mock_db.refresh.assert_called()


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
        "prep_time_minutes": 10,
        "servings": 4,
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
    mock_db.execute.assert_called()


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
    mock_db.delete.assert_called_with(mock_recipe_model)
    mock_db.commit.assert_called()


@pytest.mark.asyncio
async def test_read_recipe(mock_db, mock_user):
    # Setup
    recipe_id = uuid.uuid4()
    mock_result = MagicMock()
    mock_recipe_model = MagicMock()
    mock_recipe_model.id = recipe_id
    mock_recipe_model.created_at = datetime.now()
    mock_recipe_model.data = {
        "title": "Single Recipe",
        "video_url": "url",
        "description": "desc",
        "ingredients": [],
        "steps": [],
        "prep_time_minutes": 10,
        "servings": 4,
        "thumbnail_url": "thumb",
    }

    # Configure scalar_one_or_none returning the recipe
    mock_result.scalar_one_or_none.return_value = mock_recipe_model
    mock_db.execute.return_value = mock_result

    # Act
    result = await read_recipe(recipe_id=recipe_id, db=mock_db, current_user=mock_user)

    # Assert
    assert result.id == str(recipe_id)
    assert result.title == "Single Recipe"
    mock_db.execute.assert_called()

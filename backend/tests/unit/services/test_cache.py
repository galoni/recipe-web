import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.cache import CacheService
from app.models.recipe import RecipeData
from app.models.db import ExtractionCache
from datetime import datetime, timedelta


@pytest.fixture
def mock_db():
    return AsyncMock()


@pytest.fixture
def cache_service(mock_db):
    return CacheService(mock_db)


@pytest.mark.asyncio
async def test_get_cached_extraction_hit(cache_service, mock_db):
    # Setup mock result
    mock_entry = MagicMock()
    mock_entry.raw_result = {
        "title": "Cached Recipe",
        "description": "Desc",
        "ingredients": [],
        "instructions": [],
        "dietary_tags": [],
    }

    mock_execute_result = MagicMock()
    mock_execute_result.scalar_one_or_none.return_value = mock_entry
    mock_db.execute.return_value = mock_execute_result

    result = await cache_service.get_cached_extraction("vid123")

    assert result.title == "Cached Recipe"
    mock_db.execute.assert_called_once()


@pytest.mark.asyncio
async def test_get_cached_extraction_miss(cache_service, mock_db):
    mock_execute_result = MagicMock()
    mock_execute_result.scalar_one_or_none.return_value = None
    mock_db.execute.return_value = mock_execute_result

    result = await cache_service.get_cached_extraction("vid123")

    assert result is None


@pytest.mark.asyncio
async def test_save_extraction(cache_service, mock_db):
    recipe_data = RecipeData(
        title="New Recipe",
        description="Freshly extracted",
        ingredients=[],
        instructions=[],
        dietary_tags=[],
    )

    await cache_service.save_extraction("vid456", recipe_data)

    mock_db.merge.assert_called_once()
    mock_db.commit.assert_called_once()

    # Verify merge was called with an ExtractionCache object
    merged_obj = mock_db.merge.call_args[0][0]
    assert isinstance(merged_obj, ExtractionCache)
    assert merged_obj.video_id == "vid456"
    assert merged_obj.raw_result["title"] == "New Recipe"

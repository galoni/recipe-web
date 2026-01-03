import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.discovery import DiscoveryService
from app.models.db import Recipe as RecipeModel
from datetime import datetime
import uuid

@pytest.mark.asyncio
async def test_search_recipes_no_query():
    # Setup
    mock_db = AsyncMock()
    service = DiscoveryService(mock_db)
    
    mock_recipe = MagicMock(spec=RecipeModel)
    mock_recipe.id = uuid.uuid4()
    mock_recipe.is_public = True
    mock_recipe.created_at = datetime.now()
    mock_recipe.data = {
        "title": "Test Recipe",
        "description": "Test Desc",
        "video_url": "http://test.com",
        "ingredients": [],
        "steps": [],
        "dietary_tags": []
    }
    
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = [mock_recipe]
    mock_db.execute.return_value = mock_result
    
    # Act
    results = await service.search_recipes()
    
    # Assert
    assert len(results) == 1
    assert results[0].title == "Test Recipe"
    mock_db.execute.assert_called_once()

@pytest.mark.asyncio
async def test_search_recipes_with_query():
    # Setup
    mock_db = AsyncMock()
    service = DiscoveryService(mock_db)
    
    mock_result = MagicMock()
    mock_result.scalars.return_value.all.return_value = []
    mock_db.execute.return_value = mock_result
    
    # Act
    results = await service.search_recipes(query="chicken")
    
    # Assert
    assert len(results) == 0
    mock_db.execute.assert_called_once()

@pytest.mark.asyncio
async def test_search_recipes_exception():
    # Setup
    mock_db = AsyncMock()
    mock_db.execute.side_effect = Exception("DB error")
    service = DiscoveryService(mock_db)
    
    # Act & Assert
    with pytest.raises(Exception):
        await service.search_recipes()

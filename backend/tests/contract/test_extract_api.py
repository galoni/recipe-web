from unittest.mock import patch

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

from app.models.recipe import Ingredient, InstructionStep, RecipeData
from app.core.database import get_db
import pytest
from unittest.mock import AsyncMock, MagicMock


@pytest.fixture
def api_overrides():
    mock_session = AsyncMock()
    app.dependency_overrides[get_db] = lambda: mock_session
    # Mock existing recipe check (return None)
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = None
    mock_session.execute.return_value = mock_result
    yield mock_session
    app.dependency_overrides.clear()


def test_extract_api_contract(api_overrides):
    # Because this is a contract test, we might want to mock the heavy services
    # But ensure the input/output schema matches
    with patch("app.services.youtube.YouTubeService.get_transcript") as mock_yt, patch(
        "app.services.gemini.GeminiService.extract_recipe"
    ) as mock_gemini, patch(
        "app.services.cache.CacheService.get_cached_extraction"
    ) as mock_cache_get, patch(
        "app.services.cache.CacheService.save_extraction"
    ) as mock_cache_save:

        mock_yt.return_value = "Mock Transcript"
        mock_cache_get.return_value = None  # Force generation

        # Return actual Pydantic model as expected by strict typing in endpoint
        # Use AsyncMock for the async extract_recipe method
        mock_gemini.side_effect = AsyncMock(
            return_value=RecipeData(
                title="Mock Recipe",
                description="Mock Desc",
                ingredients=[Ingredient(item="Mock Item")],
                instructions=[InstructionStep(step_number=1, instruction="Do it")],
                dietary_tags=[],
            )
        )

        response = client.post(
            "/api/v1/extract",
            json={"video_url": "https://www.youtube.com/watch?v=12345678901"},
        )

        assert response.status_code == 200
        data = response.json()
        assert "title" in data
        assert "ingredients" in data

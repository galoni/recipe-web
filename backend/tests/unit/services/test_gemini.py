import pytest
from unittest.mock import AsyncMock, patch
from app.services.gemini import GeminiService
from app.models.recipe import RecipeData


@pytest.fixture
def gemini_service():
    return GeminiService()


@patch("app.services.gemini.settings")
@patch("google.generativeai.GenerativeModel")
@pytest.mark.asyncio
async def test_generate_recipe_success(mock_model_cls, mock_settings):
    # Setup Settings Mock
    mock_settings.GEMINI_API_KEY = "mock_key_for_test"

    # Re-instantiate service inside test to pick up mocked settings if needed
    # Or just rely on the fact that if we use the fixture it might have run before
    # Let's verify: Fixture runs at call time?
    # Actually, GeminiService() constructor runs when fixture is called.
    # If using fixture, we should ensure settings are mocked BEFORE fixture runs.
    # Cleaner to instantiate inside test for this unit case or use patch.dcit/env

    service = GeminiService()  # Use local instance
    # Setup Mock
    mock_model = mock_model_cls.return_value
    mock_response = AsyncMock()
    # Mocking strict JSON response
    mock_response.text = """
    {
        "title": "Test Recipe",
        "description": "A test",
        "ingredients": [{"item": "Egg"}],
        "instructions": [{"step_number": 1, "instruction": "Cook"}]
    }
    """
    mock_model.generate_content_async = AsyncMock(return_value=mock_response)

    result = await service.extract_recipe("Full transcript text", "video_id")

    assert isinstance(result, RecipeData)
    assert result.title == "Test Recipe"
    assert len(result.ingredients) == 1


@pytest.mark.asyncio
async def test_chunking_logic(gemini_service):
    # Test internal logic for long transcripts
    long_text = "word " * 100000
    # TODO: Implement test for smart chunking if logic is complex
    pass

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
    mock_settings.GEMINI_API_KEY = "mock_key"
    service = GeminiService()

    mock_model = mock_model_cls.return_value
    mock_response = AsyncMock()
    mock_response.text = """
    ```json
    {
        "title": "Test Recipe",
        "description": "A test",
        "ingredients": [{"item": "Egg", "quantity": "2", "unit": "pcs", "notes": ""}],
        "instructions": [{"step_number": 1, "instruction": "Cook", "duration_seconds": 60}]
    }
    ```
    """
    mock_model.generate_content_async = AsyncMock(return_value=mock_response)

    result = await service.extract_recipe("Transcript", "vid")

    assert result.title == "Test Recipe"
    assert result.ingredients[0].item == "Egg"
    assert result.instructions[0].duration_seconds == 60


@patch("app.services.gemini.settings")
@patch("google.generativeai.GenerativeModel")
@pytest.mark.asyncio
async def test_extract_recipe_error_handling(mock_model_cls, mock_settings):
    mock_settings.GEMINI_API_KEY = "mock_key"
    service = GeminiService()

    mock_model = mock_model_cls.return_value
    mock_model.generate_content_async.side_effect = Exception("API Error")

    with pytest.raises(Exception, match="API Error"):
        await service.extract_recipe("Transcript", "vid")


@pytest.mark.asyncio
async def test_chunking_limit(gemini_service):
    # Verify it limits transcript length to avoid context issues
    # GeminiService uses transcript[:30000]
    with patch.object(gemini_service, "model") as mock_model:
        mock_response = AsyncMock()
        mock_response.text = '{"title": "test", "ingredients": [], "instructions": []}'
        mock_model.generate_content_async.return_value = mock_response

        long_transcript = "A" * 50000
        await gemini_service.extract_recipe(long_transcript, "vid")

        # Check the first arg of the call
        call_args = mock_model.generate_content_async.call_args[0][0]
        assert len(long_transcript) > 30000
        assert "A" * 30000 in call_args
        assert "A" * 30001 not in call_args

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from app.models.recipe import RecipeData
from app.services.gemini import GeminiService


@pytest.fixture
def gemini_service():
    return GeminiService()


@patch("app.services.gemini.settings")
@patch("google.genai.Client")
@pytest.mark.asyncio
async def test_generate_recipe_success(mock_client_cls, mock_settings):
    mock_settings.GEMINI_API_KEY = "mock_key"
    service = GeminiService()

    mock_client = mock_client_cls.return_value
    mock_response = MagicMock()
    mock_response.text = """
    {
        "title": "Test Recipe",
        "description": "A test",
        "ingredients": [{"item": "Egg", "quantity": "2", "unit": "pcs", "notes": ""}],
        "instructions": [{"step_number": 1, "instruction": "Cook", "duration_seconds": 60}]
    }
    """
    # mock_client.aio.models.generate_content is an async method
    mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)

    result = await service.extract_recipe("Transcript", "vid")

    assert result.title == "Test Recipe"
    assert result.ingredients[0].item == "Egg"
    assert result.instructions[0].duration_seconds == 60


@patch("app.services.gemini.settings")
@patch("google.genai.Client")
@pytest.mark.asyncio
async def test_extract_recipe_error_handling(mock_client_cls, mock_settings):
    mock_settings.GEMINI_API_KEY = "mock_key"
    service = GeminiService()

    mock_client = mock_client_cls.return_value
    mock_client.aio.models.generate_content.side_effect = Exception("API Error")

    with pytest.raises(Exception, match="API Error"):
        await service.extract_recipe("Transcript", "vid")


@pytest.mark.asyncio
async def test_chunking_limit(gemini_service):
    # Verify it limits transcript length to avoid context issues
    # GeminiService uses transcript[:30000]
    with patch.object(gemini_service, "client") as mock_client:
        mock_response = MagicMock()
        mock_response.text = '{"title": "test", "ingredients": [], "instructions": []}'
        mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)

        long_transcript = "A" * 50000
        await gemini_service.extract_recipe(long_transcript, "vid")

        # Check the call args of generate_content
        call_args = mock_client.aio.models.generate_content.call_args.kwargs["contents"]
        assert len(long_transcript) > 30000
        assert "A" * 30000 in call_args
        assert "A" * 30001 not in call_args

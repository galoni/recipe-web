import json
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from app.models.recipe import RecipeData
from app.services.gemini import GeminiService


# This test simulates checking quality against golden samples
# In a real scenario, this might call the live API if cost allows, or use recorded responses
@pytest.mark.asyncio
async def test_regression_quality_golden_samples(golden_data_dir):
    samples_file = golden_data_dir / "golden_samples.json"
    if not samples_file.exists():
        pytest.skip("Golden samples not found")

    with open(samples_file) as f:
        samples = json.load(f)

    service = GeminiService()

    # Mocking appropriate response for regression if we don't want live calls in CI
    # Or we can mark it as @pytest.mark.live to only run when explicitly requested

    for sample in samples:
        video_id = sample["video_id"]
        transcript = sample["transcript_snippet"]

        # We need to mock the generate_content call to return something that matches our expectations
        # strictly for the purpose of the test structure, unless we record VCR cassettes
        # We need to mock the client and its nested methods
        with patch("google.genai.Client") as MockClient:
            mock_client = MockClient.return_value

            # Construct minimal valid JSON response for Gemini
            mock_json_response = {
                "title": sample["expected_title"],
                "description": "Regression test desc",
                "ingredients": [
                    {"item": i, "quantity": "1"} for i in sample["expected_ingredients"]
                ],
                "instructions": [{"step_number": 1, "instruction": "Test step"}],
                "dietary_tags": [],
            }

            mock_resp_obj = MagicMock()
            mock_resp_obj.text = json.dumps(mock_json_response)
            # The service calls await self.client.aio.models.generate_content(...)
            mock_client.aio.models.generate_content = AsyncMock(
                return_value=mock_resp_obj
            )

            # Need to patch settings too if service reads them
            with patch("app.services.gemini.settings") as mock_settings:
                mock_settings.GEMINI_API_KEY = "dummy"

                # Re-init service with mocked settings/client
                service = GeminiService()

                result = await service.extract_recipe(transcript, video_id)

                assert result.title == sample["expected_title"]
                # Simple inclusivity check
                found_items = [i.item for i in result.ingredients]
                for exp in sample["expected_ingredients"]:
                    assert exp in found_items

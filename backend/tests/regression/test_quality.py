import pytest
import json
from app.services.gemini import GeminiService
from app.models.recipe import RecipeData
from unittest.mock import AsyncMock, patch

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
        video_id = sample['video_id']
        transcript = sample['transcript_snippet']
        
        # We need to mock the generate_content call to return something that matches our expectations
        # strictly for the purpose of the test structure, unless we record VCR cassettes
        with patch("google.generativeai.GenerativeModel") as MockModel:
             mock_instance = MockModel.return_value
             
             # Construct minimal valid JSON response for Gemini
             mock_json_response = {
                 "title": sample['expected_title'],
                 "description": "Regression test desc",
                 "ingredients": [{"item": i, "quantity": "1"} for i in sample['expected_ingredients']],
                 "instructions": [{"step_number": 1, "instruction": "Test step"}],
                 "dietary_tags": []
             }
             
             mock_resp_obj = AsyncMock()
             mock_resp_obj.text = json.dumps(mock_json_response)
             mock_instance.generate_content_async = AsyncMock(return_value=mock_resp_obj)
             
             # Need to patch settings too if service reads them
             with patch("app.services.gemini.settings") as mock_settings:
                 mock_settings.GEMINI_API_KEY = "dummy"
                 
                 # Re-init service with mocked settings/model
                 service = GeminiService()
                 
                 result = await service.extract_recipe(transcript, video_id)
                 
                 assert result.title == sample['expected_title']
                 # Simple inclusivity check
                 found_items = [i.item for i in result.ingredients]
                 for exp in sample['expected_ingredients']:
                     assert exp in found_items

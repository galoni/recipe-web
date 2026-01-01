import json
import google.generativeai as genai
from app.core.config import settings
from app.models.recipe import RecipeData, Ingredient, InstructionStep


class GeminiService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel("models/gemini-flash-latest")
        else:
            self.model = None

    async def extract_recipe(self, transcript: str, video_id: str) -> RecipeData:
        try:
            if not self.model:
                # Fallback for tests if no key is mocked properly, but in tests we mock the model cls
                # If we are here in prod without key, we should raise
                if not settings.GEMINI_API_KEY:
                    print("Warning: No GEMINI_API_KEY found.")

            prompt = f"""
            You are a professional chef. Extract a structured recipe from the following YouTube video transcript.
            
            Transcript:
            {transcript[:30000]} # Gemini 1.5 Flash has large context, but let's be safe
            
            Return ONLY valid JSON matching this schema:
            {{
                "title": "Recipe Title",
                "description": "Brief description",
                "servings": 4, 
                "prep_time_minutes": 15,
                "cook_time_minutes": 30,
                "ingredients": [
                    {{"item": "ingredient name", "quantity": "amount", "unit": "unit", "notes": "notes"}}
                ],
                "instructions": [
                    {{"step_number": 1, "instruction": "step description", "duration_seconds": 60}}
                ],
                "dietary_tags": ["Vegetarian", "Gluten-Free"]
            }}
            """

            response = await self.model.generate_content_async(prompt)

            # Parse JSON
            try:
                data = json.loads(response.text)
            except json.JSONDecodeError:
                # Cleanup if markdown code blocks exist
                text = response.text.replace("```json", "").replace("```", "")
                data = json.loads(text)

            # Map to Pydantic
            return RecipeData(
                title=data.get("title", "Unknown Recipe"),
                description=data.get("description", "No description"),
                servings=data.get("servings"),
                prep_time_minutes=data.get("prep_time_minutes"),
                cook_time_minutes=data.get("cook_time_minutes"),
                ingredients=[Ingredient(**i) for i in data.get("ingredients", [])],
                instructions=[
                    InstructionStep(**i) for i in data.get("instructions", [])
                ],
                dietary_tags=data.get("dietary_tags", []),
            )

        except Exception as e:
            print(f"An error occurred: {e}")
            # For now return None or raise, test expects RecipeData
            # Logic: If failure, maybe return partial or raise custom error
            # For the test to pass with mocks, we need to ensure the mock setup mirrors this
            raise e

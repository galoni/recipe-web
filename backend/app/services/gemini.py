import json

from google import genai  # type: ignore

from app.core.config import settings
from app.core.logger import logger
from app.models.recipe import Ingredient, InstructionStep, RecipeData


class GeminiService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        else:
            self.client = None
        self.model_name = "gemini-flash-latest"

    async def extract_recipe(self, transcript: str, video_id: str) -> RecipeData:
        try:
            if not self.client:
                logger.warning("No GEMINI_API_KEY found.")
                raise ValueError("Gemini API key is not configured.")

            prompt = f"""
            You are a professional chef. Extract a structured recipe from the following YouTube video transcript.

            Transcript:
            {transcript[:30000]}

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

            # Use the async client
            response = await self.client.aio.models.generate_content(
                model=self.model_name, contents=prompt
            )

            # Parse JSON
            text = response.text
            try:
                data = json.loads(text)
            except json.JSONDecodeError:
                # Cleanup if markdown code blocks exist
                clean_text = text.replace("```json", "").replace("```", "").strip()
                data = json.loads(clean_text)

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
            logger.error(f"Gemini Extraction Error: {e}")
            raise e

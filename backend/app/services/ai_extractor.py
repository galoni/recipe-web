from youtube_transcript_api import YouTubeTranscriptApi
from openai import AsyncOpenAI
from app.core.config import settings
from app.schemas.recipe import RecipeCreate, Ingredient, Step
import json
import re

async def extract_video_id(url: str) -> str:
    # Simple regex for youtube ID
    # Supports youtube.com/watch?v= and youtu.be/
    regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(regex, url)
    if match:
        return match.group(1)
    raise ValueError("Invalid YouTube URL")

async def get_transcript(video_id: str) -> str:
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        # Combine text
        full_text = " ".join([i['text'] for i in transcript_list])
        return full_text
    except Exception as e:
        # Fallback or error handling
        print(f"Error fetching transcript: {e}")
        return ""

async def generate_recipe_from_video(video_url: str) -> RecipeCreate:
    video_id = await extract_video_id(video_url)
    transcript = await get_transcript(video_id)
    
    if not settings.OPENAI_API_KEY:
        # RETURN MOCK DATA IF NO API KEY
        return RecipeCreate(
            title="Mock Recipe (No API Key)",
            video_url=video_url,
            thumbnail_url=f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
            ingredients=[
                Ingredient(item="Mock Ingredient 1", amount="100g"),
                Ingredient(item="Mock Ingredient 2", amount="2 cups"),
            ],
            steps=[
                Step(time="00:10", instruction="This is a mock step because no OpenAI Key was provided."),
                Step(time="05:00", instruction="Finished!"),
            ]
        )

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    
    prompt = f"""
    You are a professional chef. Extract a structured recipe from the following YouTube video transcript.
    
    Transcript:
    {transcript[:15000]} # Truncate to fit context window if needed
    
    Return JSON format only:
    {{
        "title": "Recipe Title",
        "ingredients": [{{"item": "name", "amount": "quantity"}}],
        "steps": [{{"time": "MM:SS", "instruction": "Step description"}}]
    }}
    """
    
    response = await client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=[{"role": "system", "content": "You are a helpful assistant that outputs JSON."},
                  {"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    
    content = response.choices[0].message.content
    data = json.loads(content)
    
    return RecipeCreate(
        title=data.get("title", "Unknown Recipe"),
        video_url=video_url,
        thumbnail_url=f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
        ingredients=[Ingredient(**i) for i in data.get("ingredients", [])],
        steps=[Step(**s) for s in data.get("steps", [])]
    )

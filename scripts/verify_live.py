import asyncio
import os
import sys

# Ensure backend path is in pythonpath
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from app.services.youtube import YouTubeService
from app.services.gemini import GeminiService
from app.core.config import settings

async def main():
    if not settings.GEMINI_API_KEY:
        print("Error: GEMINI_API_KEY not set.")
        return

    # Get URL from command line or use a known working default
    url = sys.argv[1] if len(sys.argv) > 1 else "https://www.youtube.com/watch?v=szjZ3vqwyXE"
    print(f"Testing extraction for: {url}")

    try:
        print("1. Extracting Video ID...")
        video_id = YouTubeService.extract_video_id(url)
        print(f"   Video ID: {video_id}")

        print("2. Fetching Transcript (Real Network Call)...")
        transcript = YouTubeService().get_transcript(video_id)
        print(f"   Transcript Length: {len(transcript)} chars")

        print("3. Generating Recipe with Gemini (Real API Call)...")
        gemini = GeminiService()
        recipe = await gemini.extract_recipe(transcript, video_id)

        print("\n--- Success! ---")
        print(f"Title: {recipe.title}")
        print(f"Ingredients: {len(recipe.ingredients)}")
        print(f"Steps: {len(recipe.instructions)}")
        print(f"Description: {recipe.description}")

    except Exception as e:
        print(f"\n--- FAILED ---")
        print(e)

if __name__ == "__main__":
    asyncio.run(main())

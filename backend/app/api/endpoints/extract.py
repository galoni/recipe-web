from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.db import Recipe as RecipeModel
from app.models.recipe import RecipeData
from app.schemas.recipe import Ingredient, RecipeCreate, RecipeGenerateRequest, Step
from app.services.cache import CacheService
from app.services.gemini import GeminiService
from app.services.youtube import YouTubeService

router = APIRouter()


@router.post("", response_model=RecipeCreate)
async def extract_recipe(
    request: RecipeGenerateRequest, db: AsyncSession = Depends(get_db)
):
    """
    Extract a recipe from a YouTube URL.
    Checks existing recipes first, then the extraction cache, finally triggers AI.
    """
    try:
        # 1. Extract Video ID
        video_id = YouTubeService.extract_video_id(request.video_url)

        # 2. Check for existing public recipes (Instant result)
        # Using filter_by(source_url=...) or checking video_id embedded in source_url
        # Since source_url is stored, we can search by it.
        stmt = (
            select(RecipeModel)
            .where(RecipeModel.source_url.like(f"%{video_id}%"))
            .limit(1)
        )
        result = await db.execute(stmt)
        existing_recipe = result.scalar_one_or_none()

        if existing_recipe:
            recipe_data_dict: dict[str, Any] = existing_recipe.data
            return RecipeCreate(
                id=str(existing_recipe.id),
                is_public=existing_recipe.is_public,
                title=recipe_data_dict.get("title", "Unknown"),
                description=recipe_data_dict.get("description"),
                video_url=request.video_url,
                thumbnail_url=f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
                servings=recipe_data_dict.get("servings"),
                prep_time_minutes=recipe_data_dict.get("prep_time_minutes"),
                cook_time_minutes=recipe_data_dict.get("cook_time_minutes"),
                ingredients=[
                    Ingredient(**i) if isinstance(i, dict) else i
                    for i in recipe_data_dict.get("ingredients", [])
                ],
                steps=[
                    Step(**s) if isinstance(s, dict) else s
                    for s in recipe_data_dict.get("instructions", [])
                ],
                dietary_tags=recipe_data_dict.get("dietary_tags", []),
            )

        # 3. Check Cache
        cache_service = CacheService(db)
        cached_recipe = await cache_service.get_cached_extraction(video_id)

        recipe_data: RecipeData
        if cached_recipe:
            recipe_data = cached_recipe
        else:
            # 3. Get Transcript (if not cached)
            yt_service = YouTubeService()
            # This is synchronous (network I/O wrapper)
            transcript = yt_service.get_transcript(video_id)

            # 4. Generate Recipe
            recipe_data = await GeminiService().extract_recipe(transcript, video_id)

            # 5. Save to Cache
            await cache_service.save_extraction(video_id, recipe_data)

        # 6. Map to Schema (RecipeData -> RecipeCreate)
        return RecipeCreate(
            title=recipe_data.title,
            description=recipe_data.description,
            video_url=request.video_url,
            thumbnail_url=f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
            servings=recipe_data.servings,
            prep_time_minutes=recipe_data.prep_time_minutes,
            cook_time_minutes=recipe_data.cook_time_minutes,
            ingredients=[Ingredient(**i.model_dump()) for i in recipe_data.ingredients],
            steps=[
                Step(
                    step_number=s.step_number,
                    instruction=s.instruction,
                    duration_seconds=s.duration_seconds,
                )
                for s in recipe_data.instructions
            ],  # Mapping instructions -> steps
            dietary_tags=recipe_data.dietary_tags,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Log error in production
        raise HTTPException(status_code=500, detail=str(e))

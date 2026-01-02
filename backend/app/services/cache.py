from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.db import ExtractionCache
from app.models.recipe import RecipeData
from datetime import datetime, timedelta
from typing import Optional
import json
from app.schemas.recipe import (
    Ingredient,
    Step,
)  # For mapping if needed, but we store JSON
from app.core.logger import logger


class CacheService:
    def __init__(self, db: AsyncSession):
        self.db = db
        # Configurable constants could be in settings
        self.PROMPT_VERSION = "v1"
        self.MODEL_VERSION = "gemini-1.5-flash"
        self.TTL_DAYS = 30

    async def get_cached_extraction(self, video_id: str) -> Optional[RecipeData]:
        """
        Retrieve cached extraction if valid.
        """
        query = select(ExtractionCache).where(
            ExtractionCache.video_id == video_id,
            ExtractionCache.prompt_version == self.PROMPT_VERSION,
            ExtractionCache.model == self.MODEL_VERSION,
            ExtractionCache.expires_at > datetime.utcnow(),
        )
        result = await self.db.execute(query)
        cache_entry = result.scalar_one_or_none()

        if cache_entry:
            # Parse raw_result (JSON) back to RecipeData
            # Note: stored JSON keys must match RecipeData fields
            try:
                data = cache_entry.raw_result
                return RecipeData(**data)
            except Exception as e:
                logger.error(f"Cache parse error: {e}")
                return None
        return None

    async def save_extraction(self, video_id: str, recipe_data: RecipeData):
        """
        Save extraction result to cache.
        """
        # Convert RecipeData to dict for JSONB storage
        data = recipe_data.model_dump()

        # Calculate expiration
        expires_at = datetime.utcnow() + timedelta(days=self.TTL_DAYS)

        # Upsert logic (delete existing or update)
        # Simple approach: Delete old cache for this key then insert
        # Or use merge/upsert. Let's try merge if supported well or checking existence.
        # Given the PK is (video_id, prompt_version, model), merege works.

        cache_entry = ExtractionCache(
            video_id=video_id,
            prompt_version=self.PROMPT_VERSION,
            model=self.MODEL_VERSION,
            raw_result=data,
            expires_at=expires_at,
        )

        await self.db.merge(cache_entry)
        await self.db.commit()

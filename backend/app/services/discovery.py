from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.models.db import Recipe as RecipeModel
from app.schemas.recipe import Recipe as RecipeSchema
from typing import List, Optional
from app.core.logger import logger

class DiscoveryService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def search_recipes(
        self, 
        query: Optional[str] = None, 
        limit: int = 20, 
        skip: int = 0
    ) -> List[RecipeSchema]:
        """
        Search for public recipes by title, ingredients, or tags.
        """
        try:
            stmt = select(RecipeModel).where(RecipeModel.is_public == True)

            if query:
                # Basic search logic - can be improved with PostgreSQL full-text search later
                search_filter = or_(
                    RecipeModel.data["title"].astext.ilike(f"%{query}%"),
                    RecipeModel.data["description"].astext.ilike(f"%{query}%"),
                    RecipeModel.data["dietary_tags"].astext.ilike(f"%{query}%")
                )
                stmt = stmt.where(search_filter)

            stmt = stmt.order_by(RecipeModel.created_at.desc()).offset(skip).limit(limit)
            
            result = await self.db.execute(stmt)
            db_recipes = result.scalars().all()

            recipes = []
            for r in db_recipes:
                # Map DB model back to schema
                data = r.data
                recipes.append(RecipeSchema(
                    id=str(r.id), 
                    **data, 
                    is_public=r.is_public,
                    created_at=r.created_at
                ))
            
            return recipes

        except Exception as e:
            logger.error(f"Error searching recipes: {e}")
            raise

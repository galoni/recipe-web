from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.core.database import get_db
from app.models.db import Recipe as RecipeModel
from app.models.user import User as UserModel
from app.schemas.recipe import Recipe, RecipeCreate
from app.core.logger import logger

router = APIRouter()


@router.post("/", response_model=Recipe)
async def create_recipe(recipe: RecipeCreate, db: AsyncSession = Depends(get_db)):
    """
    Save a generated recipe to the database.
    """
    try:
        # Check if a dummy user exists, if not create one
        result = await db.execute(select(UserModel).where(UserModel.id == 1))
        user = result.scalar_one_or_none()
        if not user:
            # Create dummy user
            user = UserModel(
                id=1,
                email="chef@stream.com",
                hashed_password="hashed_secret",
                is_active=True,
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)

        # Map RecipeCreate schema to RecipeModel DB model
        # The DB model uses source_url and a data blob
        db_recipe = RecipeModel(
            id=uuid.uuid4(),
            user_id=user.id,
            source_url=recipe.video_url,
            data=recipe.model_dump(),  # Stores title, description, ingredients, steps, etc.
        )

        db.add(db_recipe)
        await db.commit()
        await db.refresh(db_recipe)

        # Map back to Recipe schema for response
        return Recipe(
            id=str(db_recipe.id), **recipe.model_dump(), created_at=db_recipe.created_at
        )
    except Exception as e:
        logger.error(f"Error creating recipe: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/", response_model=List[Recipe])
async def read_recipes(
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)
):
    """
    Get all recipes.
    """
    try:
        result = await db.execute(select(RecipeModel).offset(skip).limit(limit))
        db_recipes = result.scalars().all()

        # Map DB model back to schema
        recipes = []
        for r in db_recipes:
            # Data field in DB contains the original schema fields
            data = r.data
            recipes.append(Recipe(id=str(r.id), **data, created_at=r.created_at))
        return recipes
    except Exception as e:
        logger.error(f"Error reading recipes: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.core.database import get_db
from app.models.db import Recipe as RecipeModel
from app.models.user import User as UserModel
from app.api.deps import get_current_user
from app.schemas.recipe import Recipe, RecipeCreate
from app.core.logger import logger

router = APIRouter()


@router.post("/", response_model=Recipe)
async def create_recipe(
    recipe: RecipeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """
    Save a generated recipe to the database.
    """
    try:
        # Map RecipeCreate schema to RecipeModel DB model
        db_recipe = RecipeModel(
            id=uuid.uuid4(),
            user_id=current_user.id,
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
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """
    Get all recipes for the current user.
    """
    try:
        result = await db.execute(
            select(RecipeModel)
            .where(RecipeModel.user_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
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


@router.delete("/{recipe_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_recipe(
    recipe_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """
    Delete a recipe from the database.
    """
    try:
        result = await db.execute(
            select(RecipeModel).where(
                RecipeModel.id == recipe_id, RecipeModel.user_id == current_user.id
            )
        )
        db_recipe = result.scalar_one_or_none()

        if not db_recipe:
            raise HTTPException(
                status_code=404, detail="Recipe not found or not owned by user"
            )

        await db.delete(db_recipe)
        await db.commit()
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting recipe: {e}")
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

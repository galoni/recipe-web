import uuid
from typing import List, Optional

from app.api.deps import get_current_user, get_current_user_optional
from app.core.database import get_db
from app.core.logger import logger
from app.models.db import Recipe as RecipeModel
from app.models.user import User as UserModel
from app.schemas.recipe import Recipe, RecipeCreate
from app.services.discovery import DiscoveryService
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()


@router.get("/explore", response_model=List[Recipe])
async def explore_recipes(
    q: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """
    Search and explore public recipes. Does not require authentication.
    """
    discovery_service = DiscoveryService(db)
    return await discovery_service.search_recipes(query=q, skip=skip, limit=limit)


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
            is_public=recipe.is_public,
            data=recipe.model_dump(
                exclude={"id", "is_public"}
            ),  # Stores title, description, ingredients, steps, etc.
        )

        db.add(db_recipe)
        await db.commit()
        await db.refresh(db_recipe)

        # Map back to Recipe schema for response
        return Recipe(
            id=str(db_recipe.id),
            **recipe.model_dump(exclude={"id"}),
            created_at=db_recipe.created_at,
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
            recipes.append(
                Recipe(
                    id=str(r.id), **data, is_public=r.is_public, created_at=r.created_at
                )
            )
        return recipes
    except Exception as e:
        logger.error(f"Error reading recipes: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{recipe_id}", response_model=Recipe)
async def read_recipe(
    recipe_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[UserModel] = Depends(get_current_user_optional),
):
    """
    Get a specific recipe by ID.
    """
    try:
        recipe = None
        if current_user:
            result = await db.execute(
                select(RecipeModel).where(
                    RecipeModel.id == recipe_id, RecipeModel.user_id == current_user.id
                )
            )
            recipe = result.scalar_one_or_none()

        if not recipe:
            # Check if it's a public recipe even if not owned or not logged in
            result = await db.execute(
                select(RecipeModel).where(
                    RecipeModel.id == recipe_id, RecipeModel.is_public.is_(True)
                )
            )
            recipe = result.scalar_one_or_none()

        if not recipe:
            raise HTTPException(
                status_code=404, detail="Recipe not found or access denied"
            )

        data = recipe.data
        return Recipe(
            id=str(recipe.id),
            **data,
            is_public=recipe.is_public,
            created_at=recipe.created_at,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error reading recipe {recipe_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.patch("/{recipe_id}", response_model=Recipe)
async def update_recipe_privacy(
    recipe_id: uuid.UUID,
    data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    """
    Toggle recipe privacy status. Only the owner can do this.
    """
    stmt = select(RecipeModel).where(
        RecipeModel.id == recipe_id, RecipeModel.user_id == current_user.id
    )
    result = await db.execute(stmt)
    recipe = result.scalar_one_or_none()

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found or access denied")

    if "is_public" in data:
        recipe.is_public = data["is_public"]
        await db.commit()
        await db.refresh(recipe)

    return Recipe(
        id=str(recipe.id),
        **recipe.data,
        is_public=recipe.is_public,
        created_at=recipe.created_at,
    )


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

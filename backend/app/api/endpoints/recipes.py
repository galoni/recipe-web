from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.models.recipe import Recipe as RecipeModel
from app.models.user import User as UserModel
from app.schemas.recipe import Recipe, RecipeCreate, RecipeGenerateRequest
from app.services.ai_extractor import generate_recipe_from_video

router = APIRouter()

@router.post("/generate", response_model=RecipeCreate)
async def generate_recipe(request: RecipeGenerateRequest):
    """
    Generate a recipe from a YouTube URL using AI.
    Does NOT save to DB yet.
    """
    try:
        recipe_data = await generate_recipe_from_video(request.video_url)
        return recipe_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Recipe)
async def create_recipe(
    recipe: RecipeCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Save a generated recipe to the database.
    """
    # TODO: Get current user from Auth. For now, we assume user_id=1 exists or we create a dummy one.
    # Check if a dummy user exists, if not create one
    result = await db.execute(select(UserModel).where(UserModel.id == 1))
    user = result.scalar_one_or_none()
    if not user:
        # Create dummy user
        user = UserModel(email="chef@stream.com", hashed_password="hashed_secret", is_active=True)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    db_recipe = RecipeModel(
        title=recipe.title,
        video_url=recipe.video_url,
        thumbnail_url=recipe.thumbnail_url,
        ingredients=[i.model_dump() for i in recipe.ingredients],
        steps=[s.model_dump() for s in recipe.steps],
        owner_id=user.id
    )
    db.add(db_recipe)
    await db.commit()
    await db.refresh(db_recipe)
    return db_recipe

@router.get("/", response_model=List[Recipe])
async def read_recipes(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """
    Get all recipes.
    """
    result = await db.execute(select(RecipeModel).offset(skip).limit(limit))
    recipes = result.scalars().all()
    return recipes

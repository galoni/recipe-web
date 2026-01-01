from fastapi import APIRouter
from app.api.endpoints import recipes, extract

api_router = APIRouter()
api_router.include_router(recipes.router, prefix="/recipes", tags=["recipes"])
api_router.include_router(extract.router, prefix="/extract", tags=["extract"])

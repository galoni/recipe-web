from fastapi import APIRouter
from app.api.endpoints import recipes, extract, auth

api_router = APIRouter()
api_router.include_router(recipes.router, prefix="/recipes", tags=["recipes"])
api_router.include_router(extract.router, prefix="/extract", tags=["extract"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

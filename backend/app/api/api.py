from app.api.endpoints import auth, extract, recipes, security
from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(recipes.router, prefix="/recipes", tags=["recipes"])
api_router.include_router(extract.router, prefix="/extract", tags=["extract"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(security.router, prefix="/security", tags=["security"])

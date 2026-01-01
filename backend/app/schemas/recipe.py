from pydantic import BaseModel
from datetime import datetime

class Ingredient(BaseModel):
    item: str
    amount: str

class Step(BaseModel):
    time: str | None = None
    instruction: str

class RecipeBase(BaseModel):
    title: str
    video_url: str
    thumbnail_url: str | None = None
    ingredients: list[Ingredient]
    steps: list[Step]

class RecipeCreate(RecipeBase):
    pass

class Recipe(RecipeBase):
    id: int
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True

class RecipeGenerateRequest(BaseModel):
    video_url: str

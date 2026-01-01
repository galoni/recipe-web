from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

# --- Shared Models ---

class Ingredient(BaseModel):
    item: str
    quantity: Optional[str] = None
    unit: Optional[str] = None
    notes: Optional[str] = None

class Step(BaseModel):
    step_number: int
    instruction: str
    duration_seconds: Optional[int] = None
    time: Optional[str] = None # Keeping for backward compat/display if needed

# --- Base Recipe Model ---

class RecipeBase(BaseModel):
    title: str
    description: Optional[str] = None
    video_url: str
    thumbnail_url: Optional[str] = None
    servings: Optional[int] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    ingredients: List[Ingredient]
    steps: List[Step]
    dietary_tags: List[str] = []

# --- Create/Update Models ---

class RecipeCreate(RecipeBase):
    pass

class RecipeGenerateRequest(BaseModel):
    video_url: str

# --- Database Response Model ---

class Recipe(RecipeBase):
    id: str # Supports UUID
    created_at: datetime
    # owner_id: int # Making optional or handled separately

    model_config = ConfigDict(from_attributes=True)

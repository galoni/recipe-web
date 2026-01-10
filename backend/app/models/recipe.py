from typing import List, Optional

from pydantic import BaseModel


class Ingredient(BaseModel):
    item: str
    quantity: Optional[str] = None
    unit: Optional[str] = None
    notes: Optional[str] = None


class InstructionStep(BaseModel):
    step_number: int
    instruction: str
    duration_seconds: Optional[int] = None


class RecipeData(BaseModel):
    title: str
    description: str
    servings: Optional[int] = None
    prep_time_minutes: Optional[int] = None
    cook_time_minutes: Optional[int] = None
    ingredients: List[Ingredient]
    instructions: List[InstructionStep]
    dietary_tags: List[str] = []

    # Validation rules could be added here using @field_validator

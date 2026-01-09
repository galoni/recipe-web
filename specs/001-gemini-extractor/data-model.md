# Data Model: Gemini AI Extractor

## Pydantic Models (API & AI Contract)

```python
class Ingredient(BaseModel):
    item: str
    quantity: str | None
    unit: str | None
    notes: str | None

class InstructionStep(BaseModel):
    step_number: int
    instruction: str
    duration_seconds: int | None = None

class RecipeData(BaseModel):
    title: str
    description: str
    servings: int | None
    prep_time_minutes: int | None
    cook_time_minutes: int | None
    ingredients: List[Ingredient]
    instructions: List[InstructionStep]
    dietary_tags: List[str] = []

    # Validation rules
    # - ingredients array must not be empty
    # - instructions array must not be empty
```

## Database Schema (PostgreSQL)

### `extraction_cache` Table

Used to prevent calling YouTube/Gemini for recently processed videos.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `video_id` | VARCHAR(20) | PK | YouTube Video ID |
| `prompt_version` | VARCHAR(10) | PK | Version of the prompt used (e.g., "v1.0") |
| `model` | VARCHAR(50) | PK | Model identifier (e.g., "gemini-1.5-flash") |
| `raw_result` | JSONB | NOT NULL | Complete JSON output from Gemini |
| `created_at` | TIMESTAMP | DEFAULT NOW() | When extraction occurred |
| `expires_at` | TIMESTAMP | INDEX | When this cache entry goes stale |

**Indexes**:
- `idx_cache_lookup` on `(video_id, prompt_version, model)`

### `recipes` Table

The persistent "Library" of saved recipes (linked to users).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique Recipe ID |
| `user_id` | UUID | FK | Owner (optional for public?) |
| `source_url` | TEXT | NOT NULL | Original YouTube URL |
| `data` | JSONB | NOT NULL | Validated `RecipeData` |
| `created_at` | TIMESTAMP | DEFAULT NOW() | |

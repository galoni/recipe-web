from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "ChefStream"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5432/chefstream"
    )
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env", case_sensitive=True, env_file_encoding="utf-8"
    )


settings = Settings()

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "ChefStream"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str
    OPENAI_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env", case_sensitive=True, env_file_encoding="utf-8"
    )

settings = Settings()

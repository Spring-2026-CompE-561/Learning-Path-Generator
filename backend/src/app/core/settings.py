from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from pydantic import Field

#Resolve path for .env file
BASE_DIR = Path(__file__).resolve().parents[4]
ENV_FILE = BASE_DIR / ".env"

class Settings(BaseSettings):
    app_name: str = "Learning Path Generator"
    app_version: str = "1.0.0"

    secret_key: str = Field(
        default="dev_secret",
        description="The secret key for JWT",
    )

    algorithm: str = Field(
        default="Algorithm",
        description="The algorithm used for JWT",
    )

    access_token_expire_minutes: int = Field(
        default=10,
        description="Access token expiration time in minutes",
    )
    # FIXME: change datapase later on if needed
    database_url: str = Field(
        default="sqlite:///./learning_paths.db",
        description="The database URL",
    )


    #Adding config for .env file
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
    )


settings = Settings()
from pydantic_settings import BaseSettings
from pydantic import Field


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

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

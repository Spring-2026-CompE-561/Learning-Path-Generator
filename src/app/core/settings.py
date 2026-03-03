from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Learning Path Generator"
    app_version: str = "1.0.0"


settings = Settings()

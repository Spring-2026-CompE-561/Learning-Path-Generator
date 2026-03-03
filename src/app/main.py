from fastapi import FastAPI

from app.core.settings import settings

app = FastAPI(
    title=settings.app_name,
    description="An API for generating a schedule for personal learning",
    version=settings.app_version,
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

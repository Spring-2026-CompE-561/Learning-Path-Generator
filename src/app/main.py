from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.core.settings import settings
from app.core.database import Base, engine
import app.models

from app.routes.user import api_router as user_router
from app.routes.learning_path import api_router as learning_path_router
from app.routes.weekly_plan import api_router as weekly_plan_router
from app.routes.resource import api_router as resource_router

# create database tables
# if the tables do not exist, create them
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.app_name,
    description="An API for generating a schedule for personal learning",
    version=settings.app_version,
)

# adding the user router to the main app
app.include_router(user_router)
app.include_router(learning_path_router)
app.include_router(weekly_plan_router)
app.include_router(resource_router)

# configure CORRS middleware to allow requests from any origin
app.add_middleware(
    CORSMiddleware,
    # FIXME: fake front-end port for now
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

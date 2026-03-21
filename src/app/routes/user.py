from fastapi import APIRouter, Depends, status
from core.schemas import UserCreate

from core.database import get_db
from sqlalchemy.orm import Session
from typing import Annotated

# Automatically appended to all endpoints in this router
# prefix is for all path to have /users infront of it
# tags to group these endpoints together in the documentation
api_router = APIRouter(prefix="/users", tags=["users"])


# POST user registration endpoint
@api_router.post(
    "/register", response_model=UserCreate, status_code=status.HTTP_201_CREATED
)
# response model = what will be returned to the client when enter path user/register
# status code, the status code being returned if the endpoint is successful
async def register_user(user: UserCreate, db: Annotated[Session, Depends(get_db)]):
    # input is based on UserCreate Schema
    # db getting the database session from the get_db function
    return {"message": "User registration endpoint"}


@api_router.get("/login")
async def read_users():
    return {"message": "List of users"}

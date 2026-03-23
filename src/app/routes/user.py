from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated

from app.core.database import get_db
from app.schemas.user import UserCreate
from app.services.user import user_service
from app.schemas.user import User as UserSchema
from app.repository.user import UserRepository as user_repository


# Automatically appended to all endpoints in this router
# prefix is for all path to have /users infront of it
# tags to group these endpoints together in the documentation
api_router = APIRouter(prefix="/users", tags=["users"])


# POST user registration endpoint
@api_router.post(
    "/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED
)
# response model = what will be returned to the client when enter path user/register
# status code, the status code being returned if the endpoint is successful
async def register_user(
    user: UserCreate, db: Annotated[Session, Depends(get_db)]
) -> UserSchema:
    # input is based on UserCreate Schema
    # db getting the database session from the get_db function
    return user_service.register_user(db, user)


# Delete user endpoint
@api_router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Annotated[Session, Depends(get_db)]) -> None:
    db_user = user_service.get_by_id(db, user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    user_repository.delete_user(db, db_user)
    return None


@api_router.get("/login")
async def read_users():
    return {"message": "List of users"}

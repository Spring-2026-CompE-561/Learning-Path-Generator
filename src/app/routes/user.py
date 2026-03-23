from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import Annotated

from app.core.database import get_db
from app.schemas.user import UserCreate, Token
from app.services.user import user_service
from app.schemas.user import User as UserSchema
from app.repository.user import UserRepository as user_repository
from app.core.auth import create_access_token
from app.models.user import User as UserModel

from fastapi.security import OAuth2PasswordRequestForm

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
@api_router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[UserModel, Depends(user_service.get_current_user)],
) -> None:
    user_repository.delete_user(db, current_user)
    return None


# Post user login endpoint
@api_router.post("/login", response_model=Token)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[Session, Depends(get_db)],
) -> Token:
    """
    Login and get access token.

    Arguments:
        form_data: OAuth2 login form (username=email, password)
        db: Database session

    Returns:
        Token: Access token for authenticated user

    Raises:
        HTTPException: If authentication fails (invalid credentials)
    """
    # autehnicate the user with the provided email and password
    user = user_service.authenticate(
        db, email=form_data.username, password=form_data.password
    )
    # create an access token for the authenticated user
    access_token = create_access_token(data={"sub": user.email})
    return Token(access_token=access_token, token_type="bearer")

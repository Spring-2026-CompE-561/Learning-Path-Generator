from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Annotated

from app.core.settings import settings
from fastapi.security import OAuth2PasswordRequestForm
from app.core.auth import create_access_token

app = FastAPI(
    title=settings.app_name,
    description="An API for generating a schedule for personal learning",
    version=settings.app_version,
)


fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "password": "secret",
    },
    "alice": {
        "username": "alice",
        "password": "secret2",
    },
}


# request body
class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    user = fake_users_db.get(form_data.username)

    # check if user exists and password is correct
    if not user or user["password"] != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
    # generate the token and return it
    token = create_access_token(data={"sub": user["username"]})
    return {"access_token": token}

from fastapi import APIRouter

# Automatically appended to all endpoints in this router
# prefix is for all path to have /users infront of it
# tags to group these endpoints together in the documentation
api_router = APIRouter(prefix="/users", tags=["users"])


# placeholder for testing this routers
@api_router.get("/login")
async def read_users():
    return {"message": "List of users"}

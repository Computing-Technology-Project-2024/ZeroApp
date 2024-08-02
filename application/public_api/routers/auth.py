from fastapi import APIRouter

auth_router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

@auth_router.post("/sign-in")
async def sign_in():
    pass

@auth_router.post("/sign-up")
async def sign_up():
    pass

@auth_router.post("/sign-out")
async def sign_out():
    pass

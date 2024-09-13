from typing import Annotated

from fastapi import APIRouter, Depends

from public_api.schemas.account import Account
from public_api.services.auth import oauth2_scheme

auth_router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

@auth_router.get("/auth/users")
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    temp = Account()
    temp.username = "Thang" + token
    return temp

@auth_router.post("/sign-in")
async def sign_in():
    pass

@auth_router.post("/sign-up")
async def sign_up():
    pass

@auth_router.post("/sign-out")
async def sign_out():
    pass

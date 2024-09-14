import os
from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from ..schemas.account import Account
from ..services.auth import oauth2_scheme, create_token, authenticate_user

auth_router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

@auth_router.get("/auth/users")
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    temp = Account()
    temp.username = "Thang" + token
    return temp

@auth_router.post("/token", response_model=Token)
async def sign_in_for_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_exp = timedelta(minutes=os.getenv("ACCESS_TOKEN_EXP_MINUTES"))
    access_token = create_token(
        data={"sub": user.username},
        expires_delta=access_token_exp
    )

    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.post("/sign-up")
async def sign_up():
    pass

@auth_router.post("/sign-out")
async def sign_out():
    pass

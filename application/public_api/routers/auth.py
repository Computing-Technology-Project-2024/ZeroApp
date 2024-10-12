import os
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient

from ..database import get_db
from ..schemas.account import Account
from ..schemas.auth import SignUp
from ..services.auth import create_token, authenticate_user

from ..data_access.account_repository import (
    get_account_by_email as get_account_by_email_repo,
    add_account as add_account_repo,
)

auth_router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

@auth_router.post("/token")
async def sign_in_for_token(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncIOMotorClient = Depends(get_db)):
    user = await authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_exp = timedelta(minutes=float(os.getenv("ACCESS_TOKEN_EXP_MINUTES")))
    access_token = create_token(
        data={"sub": form_data.username},
        expires_delta=access_token_exp
    )
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.post("/sign-up")
async def sign_up(data: SignUp, db: AsyncIOMotorClient = Depends(get_db)):
    # step 1: check if email exist ? return 500
    existing_user = await get_account_by_email_repo(data.email, db)

    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exist",
        )

    # step 2: update db (pwd is hashed inside the add account func)
    try:
        account = Account(
            username=data.username,
            email=data.email,
            mobile_number="",
            password=data.password,
            is_admin=False
        )

        # Call the function with the created account and database
        res = await add_account_repo(account=account, db=db)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred signing up: {e}",
        )
    else:
        return res

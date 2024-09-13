import os
from datetime import timedelta, datetime

import dotenv
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from passlib.context import CryptContext

from public_api.data_access.account_repository import get_account_by_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
dotenv.load_dotenv()

def hash_pwd(pwd: str):
    return password_context.hash(pwd)

# hashed pwd must be stored in str
def verify_pwd(raw_pwd: str, hashed_pwd: str):
    return password_context.verify(raw_pwd, hashed_pwd)

# return user if pwd matches
async def authenticate_user(email: str, password: str):
    user = await get_account_by_email(email)

    if not user or not verify_pwd(password, user.hashed_password):
        return False
    return user

def create_token(data: dict, expires_delta: timedelta = None):
    body_data = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=15))
    body_data.update({"exp": expire})

    return jwt.encode(body_data, os.getenv("ZERO_SECRET_KEY"), algorithm=os.getenv("HASH_ALGORITHM"))

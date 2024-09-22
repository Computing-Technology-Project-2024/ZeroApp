import os
import dotenv

from datetime import timedelta, datetime

from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from passlib.context import CryptContext

import bcrypt

from public_api.data_access.account_repository import get_account_by_email
from public_api.schemas.account import Account
from public_api.utils.security import verify_password

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

dotenv.load_dotenv()

# check if provided pwd matches the email's pwd
async def authenticate_user(email: str, password: str, db) -> Account | None:
    user = await get_account_by_email(email, db)

    if not user:
        raise Exception(f"User with email: {email} doesnt exist.")

    if not verify_password(password, user.hashed_password):
        return None
    return user

def create_token(data: dict, expires_delta: timedelta = None):
    body_data = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=15))
    body_data.update({"exp": expire})

    return jwt.encode(body_data, os.getenv("ZERO_SECRET_KEY"), algorithm=os.getenv("HASH_ALGORITHM"))

def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, os.getenv("ZERO_SECRET_KEY"), algorithms=os.getenv("HASH_ALGORITHM"))
        return payload
    except Exception as e:
        raise Exception("An error occurred. ", e)

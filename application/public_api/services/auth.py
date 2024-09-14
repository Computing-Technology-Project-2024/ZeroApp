import os
import dotenv

from datetime import timedelta, datetime

from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from passlib.context import CryptContext

from public_api.data_access.account_repository import get_account_by_email
from public_api.schemas.account import Account, Role
from public_api.utils.security import verify_password

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

dotenv.load_dotenv()

async def authenticate_user(email: str, password: str) -> Account | None:
    user = await get_account_by_email(email)

    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

def create_token(data: dict, expires_delta: timedelta = None):
    body_data = data.copy()
    expire = datetime.now() + (expires_delta or timedelta(minutes=15))
    body_data.update({"exp": expire})

    return jwt.encode(body_data, os.getenv("ZERO_SECRET_KEY"), algorithm=os.getenv("HASH_ALGORITHM"))

from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from passlib.handlers import bcrypt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_pwd(pwd: str):
    return bcrypt.hashpw(pwd.encode("utf-8"), bcrypt.gensalt())

# hashed pwd must be stored in str
def verify_pwd(raw_pwd: str, hashed_pwd: str):
    return bcrypt.checkpw(raw_pwd.encode("utf-8"), hashed_pwd.encode("utf-8"))

def create_token():
    pass

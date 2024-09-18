from pydantic import BaseModel, EmailStr

class SignIn(BaseModel):
    email: EmailStr
    password: str

class SignUp(BaseModel):
    username: str
    email: EmailStr
    password: str

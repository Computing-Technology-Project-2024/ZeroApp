from pydantic import BaseModel, EmailStr


class SignInDto(BaseModel):
    email: EmailStr
    password: str

class SignUpDto(BaseModel):
    email: EmailStr
    username: str
    password: str

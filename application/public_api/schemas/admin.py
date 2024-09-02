from pydantic import BaseModel, EmailStr

class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class AdminResponse(BaseModel):
    id: str
    name: str
    email: EmailStr

    class Config:
        orm_mode = True

from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class Admin(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    name: str
    email: str
    password: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

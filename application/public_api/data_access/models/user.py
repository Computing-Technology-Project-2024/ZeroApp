from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
from datetime import datetime

class User(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    username: str
    email: str
    mobile: Optional[str] = None
    created: datetime

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

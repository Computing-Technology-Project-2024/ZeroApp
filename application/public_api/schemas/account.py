from enum import Enum
from typing import Optional

from bson.objectid import ObjectId
from pydantic import BaseModel, Field, EmailStr


class Role(Enum):
    DEFAULT = 0
    ADMIN = 1

class Account(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    deleted: bool
    username: str
    password_hash: str
    email: EmailStr
    mobile_number: str
    role: Role

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        use_enum_values = True

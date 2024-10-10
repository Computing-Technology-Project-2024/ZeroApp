from enum import Enum
from typing import Optional, Annotated

from bson.objectid import ObjectId
from pydantic import BaseModel, Field, EmailStr, BeforeValidator, field_serializer

PyObjectId = Annotated[str, BeforeValidator(str)]

class Role(str, Enum):
    DEFAULT = "default"
    ADMIN = "admin"

class Account(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    deleted: bool = Field(default=False)
    username: str
    password_hash: Optional[str] = Field(default=None)
    email: str
    mobile_number: str
    role: Role = Field(default=Role.DEFAULT)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}
        use_enum_values = True
        populate_by_name=True
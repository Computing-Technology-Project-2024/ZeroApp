from enum import Enum
from typing import Optional, Annotated

from bson.objectid import ObjectId
from pydantic import BaseModel, Field, EmailStr, BeforeValidator, field_serializer

PyObjectId = Annotated[str, BeforeValidator(str)]

class Role(str, Enum):
    DEFAULT = "default"
    ADMIN = "admin"

class Account(BaseModel):
    # Create empty shell to be activated later
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    deleted: bool = Field(default=False)
    username: Optional[str] = Field(default=None)
    password_hash: Optional[str] = Field(default=None)
    email: Optional[str] = Field(default=None)
    mobile_number: Optional[str] = Field(default=None)
    role: Role = Field(default=Role.DEFAULT)
    activated: bool = Field(default=False)
    authorization_code: Optional[str] = Field(default=None)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}
        use_enum_values = True
        populate_by_name=True

class CreateAccountIntermediateHandling(BaseModel):
    username: str
    password: str
    email: EmailStr
    mobile_number: str

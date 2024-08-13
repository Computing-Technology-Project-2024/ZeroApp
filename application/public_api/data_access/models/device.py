from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId
from datetime import datetime

class Device(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    product: str
    install_date: Optional[datetime] = None
    inactive: Optional[str] = None
    site_id: ObjectId

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

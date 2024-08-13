from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class Site(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    site_label: str
    site_address: str
    lat: float
    long: float
    site_type: str
    partner: str
    user_id: ObjectId

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

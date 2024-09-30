from typing import Optional
from bson.objectid import ObjectId
from pydantic import BaseModel, Field


class Coordinates(BaseModel):
    lat: float
    long: float

class Site(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    homeowner_id: ObjectId
    deleted: bool
    site_label: str
    site_address: str
    coords: Coordinates  # Use the nested Pydantic model
    site_type: str
    partner: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

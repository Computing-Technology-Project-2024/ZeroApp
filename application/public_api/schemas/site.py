from typing import Optional, Union
from bson.objectid import ObjectId
from pydantic import BaseModel, Field


class Coordinates(BaseModel):
    lat: float
    long: float

class Site(BaseModel):
    id: Optional[ObjectId] = Field(default=None, alias="_id")
    homeowner_id: Union[str, ObjectId]
    site_label: str
    site_address: str
    coords: Coordinates
    site_type: str
    partner: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

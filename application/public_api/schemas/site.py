from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, Field


class Site(BaseModel):
    _id: Optional[ObjectId] = Field(alias="_id")
    homeowner_id: ObjectId
    deleted: bool
    site_label: str
    site_address: str
    coords: {
        "lat": float,
        "long": float
    }
    site_type: str
    partner: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

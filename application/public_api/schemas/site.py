from bson.objectid import ObjectId

from typing import Optional, Annotated, List, Union
from pydantic import BaseModel, Field, BeforeValidator

PyObjectId = Annotated[str, BeforeValidator(str)]

class Coordinates(BaseModel):
    lat: float
    long: float

class Site(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    account_id: Optional[PyObjectId] = Field(default=None)
    site_id: Optional[int] = Field(default=None)
    deleted: bool = Field(default=False)
    site_label: Optional[str] = Field(default=None)
    site_address: str
    lat: float
    lng: float
    usage_rate_kwh: Optional[float] = Field(default=None)
    daily_flat_fee: Optional[float] = Field(default=None)

    #need clarificataion for these fields
    site_type: Optional[str] = Field(default=None)
    partner: Optional[str] = Field(default=None)

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}
        populate_by_name=True

class SiteList(BaseModel):
    sites: List[Site]
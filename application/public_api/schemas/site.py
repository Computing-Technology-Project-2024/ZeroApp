from typing import Optional

from typing import Optional, Annotated, List
from pydantic import BaseModel, Field, BeforeValidator

PyObjectId = Annotated[str, BeforeValidator(str)]

class Site(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    homeowner_id: Optional[PyObjectId] = Field(default=None)
    site_id: Optional[int] = Field(default=None)
    deleted: bool = Field(default=False)
    site_label: Optional[str]
    site_address: str
    lat: float
    lng: float

    #need clarificataion for these fields
    site_type: str = Field(default="")
    partner: str = Field(default="")

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}

class SiteList(BaseModel):
    sites: List[Site]
import datetime
from typing import Optional, Annotated
from pydantic import BaseModel, Field, BeforeValidator
from bson import ObjectId

PyObjectId = Annotated[str, BeforeValidator(str)]

class HomeOwnerDetails(BaseModel):
    first_name: str
    last_name: str
    dob: str

    class Config:
        arbitrary_types_allowed = True

class HomeOwnerAddress(BaseModel):
    street_address: str
    state: str
    postal_code: str


class HomeOwner(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    account_id:  PyObjectId
    deleted: bool = Field(default=False)
    #Can have list of Site Ids, maybe based on the different APIs
    details: HomeOwnerDetails
    private_details: HomeOwnerAddress

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}
        populate_by_name=True
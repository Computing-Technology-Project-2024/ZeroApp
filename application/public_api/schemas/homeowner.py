import datetime
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, Field

# need further clarification on the bracket
class HomeOwner(BaseModel):
    _id: Optional[ObjectId] = Field(alias="_id")
    account_id: ObjectId
    created: datetime
    active: bool
    details: {
        "first_name": str,
        "last_name": str,
        "dob": datetime.date
    }
    private_details: {
        "address": {
            "street_address": str,
            "state": str,
            "postal_code": str
        }
    }

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

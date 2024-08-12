from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class Circuit(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    watt: int
    current: float
    voltage: float
    device_id: ObjectId

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

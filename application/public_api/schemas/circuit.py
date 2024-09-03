from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, Field

class Circuit(BaseModel):
    _id: Optional[ObjectId] = Field(alias="_id")
    device_id: ObjectId
    metrics: {}

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# TODO: need to clarify this class relationship with Circuit. Temporary only
class CircuitMetric(BaseModel):
    _id: ObjectId
    circuit_id: ObjectId
    phase: int
    watt: float
    var: int
    current: float
    voltage: float
    channel_label: str
    pf: float
    polarity: str

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

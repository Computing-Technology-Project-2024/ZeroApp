from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, Field

class Circuit(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    device_id: ObjectId
    metrics: []

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# One circuit has many circuitMetrics
class CircuitMetric(BaseModel):
    id: ObjectId
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

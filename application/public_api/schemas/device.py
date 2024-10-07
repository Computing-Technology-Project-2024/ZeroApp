import datetime

from typing import Optional
from bson import ObjectId
from pydantic import BaseModel, Field

class Device(BaseModel):
    id: Optional[ObjectId] = Field(alias="_id")
    site_id: ObjectId
    active: bool
    install_date: datetime
    product: str
    # need clarification here too
    metrics: []

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

class DeviceMetric(BaseModel):
    id: ObjectId
    device_id: ObjectId
    start_time: datetime
    sum_watt: float
    sum_current: float
    sum_voltage: float
    sum_pf: float
    avg_current: float
    avg_voltage: float
    avg_pf: float

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}


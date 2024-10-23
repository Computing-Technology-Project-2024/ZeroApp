import datetime
from typing import List, Optional, Union
from bson import ObjectId
from pydantic import BaseModel, Field

class DeviceMetric(BaseModel):
    date: datetime.date
    count: int
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


class Device(BaseModel):
    id: Optional[ObjectId] = Field(default=None, alias="_id")
    site_id: Union[str, ObjectId]
    active: bool
    install_date: datetime.date
    product: str
    device_metric: List[DeviceMetric]  # List of DeviceMetric objects

    class Config:
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

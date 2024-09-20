from fastapi import APIRouter
from public_api.services.ecx_api import fetch_device_parameters, fetch_critical_parameters
import time

device_router = APIRouter(
    prefix="/devices",
    tags=["device"]
)

@device_router.get("/")
async def get_all_devices():
    pass

@device_router.get("/{device_id}")
async def get_device_by_id(device_id: str, start_time: int | None = int(time.time())-3600, end_time: int | None = int(time.time())):
    """
    Get request for a specified device. Optional start and end times are added as query parameters.
    e.g. http://127.0.0.1:8000/devices/EE40400611940374?start_time=1725148800&end_time=1725152400
    EdgeConX has basic error handling on their side.
    """
    return fetch_critical_parameters(device_id, start_time, end_time)

@device_router.post("/")
async def add_new_device():
    pass

@device_router.patch("/")
async def update_device_data():
    pass

@device_router.delete("/")
async def delete_device():
    pass

from fastapi import APIRouter
from public_api.services.ecx_api import fetch_device_parameters, fetch_critical_parameters
import time

device_router = APIRouter(
    prefix="/device",  # Define a prefix for all device routes
)

"""
Get request for a specified device. Optional start and end times are added as query parameters.
e.g. http://127.0.0.1:8000/devices/EE40400611940374?start_time=1725148800&end_time=1725152400
EdgeConX has basic error handling on their side.
"""
@device_router.get("/{device_id}")
async def get_device_by_id(
    device_id: str,
    start_time: int | None = int(time.time())-3600,
    end_time: int | None = int(time.time())
):
    return fetch_critical_parameters(device_id, start_time, end_time)

# # API to create a new device
# @device_router.post("/", response_model=Device)
# async def create_device_api(device_data: Device, db: AsyncIOMotorClient = Depends(get_db)):
#     # Ensure site_id is a valid ObjectId
#     if isinstance(device_data.site_id, str):
#         device_data.site_id = ObjectId(device_data.site_id)
    
#     # Use model_dump to handle the data and exclude unset fields
#     device_dict = device_data.model_dump(exclude_unset=True)
    
#     # Insert the new device into the database
#     device_id = await add_new_device_service(device_dict, db)
    
#     # Return success message and device_id
#     return {"message": "Device created successfully", "device_id": device_id}



# # API to get a device by id
# @device_router.get("/{device_id}", response_model=Device)
# async def get_device_by_id_api(device_id: str, db: AsyncIOMotorClient = Depends(get_db)):
#     device = await get_device_by_id_service(device_id, db)
#     if not device:
#         raise HTTPException(status_code=404, detail="Device not found")
#     return device



# # API to get all devices
# @device_router.get("/", response_model=List[Device])
# async def get_all_devices_api(db: AsyncIOMotorClient = Depends(get_db)):
#     devices = await get_all_devices_service(db)
#     return devices



# # API to update a device
# @device_router.patch("/{device_id}")
# async def update_device_api(device_id: str, update_data: dict, db: AsyncIOMotorClient = Depends(get_db)):
#     success = await update_device_service(device_id, update_data, db)
#     if success:
#         return {"message": "Device updated successfully"}
#     else:
#         raise HTTPException(status_code=404, detail="Device not found")



# # API to delete a device
# @device_router.delete("/{device_id}")
# async def delete_device_api(device_id: str, db: AsyncIOMotorClient = Depends(get_db)):
#     success = await delete_device_service(device_id, db)
#     if success:
#         return {"message": "Device deleted successfully"}
#     else:
#         raise HTTPException(status_code=404, detail="Device not found")

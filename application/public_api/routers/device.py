# from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException
# from typing import List
# from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
# from ..schemas.device import Device
# from ..services.device_service import (
#     add_new_device_service,
#     get_device_by_id_service,
#     get_all_devices_service,
#     update_device_service,
#     delete_device_service
# )
# from ..database import get_db
# from motor.motor_asyncio import AsyncIOMotorClient

device_router = APIRouter(
    prefix="/device",  # Define a prefix for all device routes
)



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

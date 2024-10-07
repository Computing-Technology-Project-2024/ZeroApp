# from public_api.data_access.device_repository import (
#     add_new_device,
#     get_device_by_id,
#     get_all_devices,
#     update_device,
#     delete_device,
# )
# from motor.motor_asyncio import AsyncIOMotorDatabase
# from typing import Optional, List
# from bson import ObjectId
# from fastapi import APIRouter, Depends, HTTPException, status

# # Service to add a new device
# async def add_new_device_service(device_data: dict, db: AsyncIOMotorDatabase) -> str:
#     # Insert the device into the collection
#     result = await db["devices"].insert_one(device_data)
#     return str(result.inserted_id)

# # Service to get a device by ID
# async def get_device_by_id_service(device_id: str, db: AsyncIOMotorDatabase) -> Optional[dict]:
#     return await get_device_by_id(device_id, db)

# # Service to get all devices
# async def get_all_devices_service(db: AsyncIOMotorDatabase) -> List[dict]:
#     return await get_all_devices(db)

# # Service to update a device
# async def update_device_service(device_id: str, update_data: dict, db: AsyncIOMotorDatabase) -> bool:
#     return await update_device(device_id, update_data, db)

# # Service to soft-delete a device
# async def delete_device_service(device_id: str, db: AsyncIOMotorDatabase) -> bool:
#     return await delete_device(device_id, db)

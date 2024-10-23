# from motor.motor_asyncio import AsyncIOMotorDatabase
# from bson import ObjectId
# from typing import Optional, List

# # Create a new device
# async def add_new_device(device_data: dict, db: AsyncIOMotorDatabase) -> str:
#     result = await db["devices"].insert_one(device_data)
#     return str(result.inserted_id)

# # Get a device by ID
# async def get_device_by_id(device_id: str, db: AsyncIOMotorDatabase) -> Optional[dict]:
#     device = await db["devices"].find_one({"_id": ObjectId(device_id)})
#     return device

# # Get all devices
# async def get_all_devices(db: AsyncIOMotorDatabase) -> List[dict]:
#     devices = await db["devices"].find().to_list(length=100)
#     return devices

# # Update a device
# async def update_device(device_id: str, update_data: dict, db: AsyncIOMotorDatabase) -> bool:
#     result = await db["devices"].update_one(
#         {"_id": ObjectId(device_id)},
#         {"$set": update_data}
#     )
#     return result.modified_count > 0

# # Soft-delete a device
# async def delete_device(device_id: str, db: AsyncIOMotorDatabase) -> bool:
#     result = await db["devices"].update_one(
#         {"_id": ObjectId(device_id)},
#         {"$set": {"active": False}}  # Soft delete by setting 'active' to False
#     )
#     return result.modified_count > 0

from fastapi import Depends
from bson.objectid import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from public_api.schemas.device import Device

collection_name = "devices"

async def get_device(device_id: str, db: AsyncIOMotorDatabase) -> Device:
    device = await db[collection_name].find_one({"_id": ObjectId(device_id)})
    return Device(**device) if device else None

async def create_device(device: Device, db: AsyncIOMotorDatabase) -> Device:
    result = await db[collection_name].insert_one(device.dict(by_alias=True))
    return Device(**device.dict(by_alias=True, _id=result.inserted_id))

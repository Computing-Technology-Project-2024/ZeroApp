from fastapi import Depends
from bson.objectid import ObjectId

from public_api.database import get_collection
from public_api.schemas.device import Device

async def get_device(device_id: str, db=Depends(get_collection("devices"))) -> Device:
    device = await db.find_one({"_id": ObjectId(device_id)})
    return Device(**device) if device else None

async def create_device(device: Device, db=Depends(get_collection("devices"))) -> Device:
    result = await db.insert_one(device.dict(by_alias=True))
    return Device(**device.dict(by_alias=True, _id=result.inserted_id))

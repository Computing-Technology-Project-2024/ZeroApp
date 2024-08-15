from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from public_api.database import get_db
from public_api.schemas.device import Device


class DeviceRepository:

    def __init__(self, db: AsyncIOMotorDatabase = Depends(get_db)):
        self.collection = db.get_collection("devices")

    async def get_device(self, device_id: str) -> Device:
        device = await self.collection.find_one({"_id": ObjectId(device_id)})
        return Device(**device) if device else None

    async def create_device(self, device: Device) -> Device:
        result = await self.collection.insert_one(device.dict(by_alias=True))
        return Device(**device.dict(by_alias=True, _id=result.inserted_id))

from motor.motor_asyncio import AsyncIOMotorClient
from data_access.models.device import Device
from bson import ObjectId

class DeviceRepository:

    def __init__(self, db):
        self.collection = db.get_collection("devices")

    async def get_device(self, device_id: str) -> Device:
        device = await self.collection.find_one({"_id": ObjectId(device_id)})
        return Device(**device) if device else None

    async def create_device(self, device: Device) -> Device:
        result = await self.collection.insert_one(device.dict(by_alias=True))
        return Device(**device.dict(by_alias=True, _id=result.inserted_id))

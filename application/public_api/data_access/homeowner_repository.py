from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from public_api.database import get_db
from public_api.schemas.homeowner import HomeOwner


class UserRepository:
    def __init__(self, db: AsyncIOMotorDatabase = Depends(get_db)):
        self.collection = db.get_collection("homeowners")

    async def get_homeowner(self, ho_id: str) -> HomeOwner:
        homeowner = await self.collection.find_one({"_id": ObjectId(ho_id)})
        return HomeOwner(**homeowner) if homeowner else None

    # TODO: since 1 Account is linked to 1 HomeOwner, this implementation needs to change
    async def create_homeowner(self, ho: HomeOwner) -> HomeOwner:
        result = await self.collection.insert_one(ho.dict(by_alias=True))
        return HomeOwner(**ho.dict(by_alias=True, _id=result.inserted_id))

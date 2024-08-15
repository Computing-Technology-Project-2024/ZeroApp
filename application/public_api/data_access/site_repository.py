from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from public_api.database import get_db
from public_api.schemas.site import Site


class SiteRepository:

    def __init__(self, db: AsyncIOMotorDatabase = Depends(get_db)):
        self.collection = db.get_collection("sites")

    async def get_site(self, site_id: str) -> Site:
        site = await self.collection.find_one({"_id": ObjectId(site_id)})
        return Site(**site) if site else None

    async def create_site(self, site: Site) -> Site:
        result = await self.collection.insert_one(site.dict(by_alias=True))
        return Site(**site.dict(by_alias=True, _id=result.inserted_id))

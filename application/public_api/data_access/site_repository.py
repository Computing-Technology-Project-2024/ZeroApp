from fastapi import Depends
from bson.objectid import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from public_api.schemas.site import Site

collection_name = "sites"

async def get_site(site_id: str, db: AsyncIOMotorDatabase) -> Site:
    site = await db[collection_name].find_one({"_id": ObjectId(site_id)})
    return Site(**site) if site else None

async def create_site(site: Site, db: AsyncIOMotorDatabase) -> Site:
    result = await db[collection_name].insert_one(site.dict(by_alias=True))
    return Site(**site.dict(by_alias=True, _id=result.inserted_id))

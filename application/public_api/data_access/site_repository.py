from fastapi import Depends
from bson.objectid import ObjectId

from public_api.database import get_collection
from public_api.schemas.site import Site

async def get_site(site_id: str, db=Depends(get_collection("devices"))) -> Site:
    site = await db.find_one({"_id": ObjectId(site_id)})
    return Site(**site) if site else None

async def create_site(site: Site, db=Depends(get_collection("devices"))) -> Site:
    result = await db.insert_one(site.dict(by_alias=True))
    return Site(**site.dict(by_alias=True, _id=result.inserted_id))

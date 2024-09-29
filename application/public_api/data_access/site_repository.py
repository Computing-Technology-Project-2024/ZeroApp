from fastapi import Depends
from pymongo import UpdateOne
from bson.objectid import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from public_api.schemas.site import Site, SiteList

collection_name = "sites"

async def get_site(site_id: str, db: AsyncIOMotorDatabase) -> Site:
   site = await db["sites"].find_one({
       # can add where homeowner == session.homeowner or is admin for authorization
        "_id": ObjectId(site_id),
        "deleted": False
   })
   return Site(**site) if site else None

async def create_site(site: Site, db: AsyncIOMotorDatabase) -> Site:
    result = await db[collection_name].insert_one(site.dict(by_alias=True))
    return Site(**site.dict(by_alias=True, _id=result.inserted_id))

async def update_all_sites(site_list: SiteList, db: AsyncIOMotorDatabase):
    # Will make collection if not exists

    operations = []

    for site in site_list.sites:
        operations.append(
            UpdateOne(
                {"site_id": site.site_id},
                {"$set": site.model_dump(by_alias=True, exclude=["id"])},
                upsert=True
            )
        )

    result = await db["sites"].bulk_write(operations)

    # Convert upserted_ids to string
    upserted_ids = {str(k): str(v) for k, v in result.upserted_ids.items()}

    return {
        "matched_count": result.matched_count,
        "modified_count": result.modified_count,
        "upserted_count": result.upserted_count,
        "upserted_ids": upserted_ids
    }

async def get_all_sites_from_db(filt: dict,  db: AsyncIOMotorDatabase):
    cursor = db["sites"].find(filt)
    documents = await cursor.to_list(length=None)
    sites = [Site(**doc) for doc in documents] # Convert to site models

    return SiteList(sites=sites) # Assign sites field in SiteList to the sites
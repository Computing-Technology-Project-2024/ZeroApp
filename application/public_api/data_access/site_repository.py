from fastapi import Depends
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional, List
from public_api.schemas.site import Site

collection_name = "sites"

async def add_new_site(site_data: dict, db: AsyncIOMotorDatabase) -> str:
    result = await db["sites"].insert_one(site_data)
    return str(result.inserted_id)

# Function to get a site by its ID
async def get_site_by_id(site_id: str, db: AsyncIOMotorDatabase) -> Optional[dict]:
    # Convert site_id to ObjectId for querying
    site = await db["sites"].find_one({"_id": ObjectId(site_id), "deleted": False})
    return site

# Function to get all sites
async def get_all_sites(db: AsyncIOMotorDatabase) -> List[dict]:
    sites = await db["sites"].find({"deleted": False}).to_list(length=100)
    return sites

# Function to update a site (partial updates with dictionary params)
async def update_site(site_id: str, update_data: dict, db: AsyncIOMotorDatabase) -> bool:
    result = await db["sites"].update_one(
        {"_id": ObjectId(site_id), "deleted": False}, 
        {"$set": update_data}
    )
    return result.modified_count > 0

# Function to delete (soft-delete) a site by marking it as deleted
async def delete_site(site_id: str, db: AsyncIOMotorDatabase) -> bool:
    result = await db["sites"].delete_one({"_id": ObjectId(site_id)})
    return result.deleted_count > 0

from public_api.data_access.site_repository import (
    add_new_site, 
    get_site_by_id, 
    get_all_sites, 
    update_site, 
    delete_site
)
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional, List
from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, status

# Service to add a new site
async def add_new_site_service(site_data: dict, db: AsyncIOMotorDatabase) -> str:
    site_id = await add_new_site(site_data, db)
    return site_id

# Service to get a site by its ID
async def get_site_by_id_service(site_id: str, db: AsyncIOMotorDatabase) -> Optional[dict]:
    # Ensure the site_id is a valid ObjectId
    if not ObjectId.is_valid(site_id):
        raise HTTPException(status_code=400, detail="Invalid site ID format")
    
    site = await get_site_by_id(site_id, db)
    
    # Convert ObjectId to string before returning
    if site:
        site["_id"] = str(site["_id"])  # Convert ObjectId to string
        site["homeowner_id"] = str(site["homeowner_id"])  # Convert any other ObjectId to string as needed
    return site

# Service to get all sites
async def get_all_sites_service(db: AsyncIOMotorDatabase) -> List[dict]:
    sites = await get_all_sites(db)
    return sites

# Service to update a site
async def update_site_service(site_id: str, update_data: dict, db: AsyncIOMotorDatabase) -> bool:
    success = await update_site(site_id, update_data, db)
    return success

# Service to delete a site
async def delete_site_service(site_id: str, db: AsyncIOMotorDatabase) -> bool:
    success = await delete_site(site_id, db)
    return success

from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Dict
from bson import ObjectId

from ..database import get_db
from ..schemas.site import Site, Coordinates
from ..services.site_service import (
    add_new_site_service,
    get_site_by_id_service,
    get_all_sites_service,
    update_site_service,
    delete_site_service
)

site_router = APIRouter(
    prefix="/site",
    tags=["site"]
)



# API to create a new site
"""
POST http://localhost:8000/site
Content-Type: application/json

{
    "homeowner_id": "60f7d4ccf82e4e06fc36eb0d",
    "site_label": "Home",
    "site_address": "123 Main St",
    "coords": {
        "lat": 40.7128,
        "long": -74.0060
    },
    "site_type": "Residential",
    "partner": "PartnerCompany"
}
"""
@site_router.post("")
async def create_site_api(site_data: Site, db: AsyncIOMotorClient = Depends(get_db)):
    try:
        # Convert homeowner_id from string to ObjectId if necessary
        if isinstance(site_data.homeowner_id, str):
            try:
                site_data.homeowner_id = ObjectId(site_data.homeowner_id)
            except:
                raise HTTPException(status_code=400, detail="Invalid ObjectId for homeowner_id")

        # Convert to dictionary and exclude unset fields
        site_dict = site_data.model_dump(exclude_unset=True)
        site_dict["_id"] = ObjectId()  # MongoDB will generate an _id
        site_id = await add_new_site_service(site_dict, db)
        return {"message": "Site created successfully", "site_id": site_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



# API to get a site by ID
# GET http://localhost:8000/site/60f7d4ccf82e4e06fc36eb0d
@site_router.get("/{site_id}")
async def get_site_by_id_api(site_id: str, db: AsyncIOMotorClient = Depends(get_db)):
    site = await get_site_by_id_service(site_id, db)
    if site:
        return site
    raise HTTPException(status_code=404, detail="Site not found")



# API to get all sites
# GET http://localhost:8000/site
@site_router.get("/")
async def get_all_sites_api(db: AsyncIOMotorClient = Depends(get_db)):
    sites = await get_all_sites_service(db)
    
    # Convert ObjectId to string before returning the data
    for site in sites:
        site["_id"] = str(site["_id"])
        site["homeowner_id"] = str(site["homeowner_id"])
    return sites



# API to update a site (using dictionary input)
"""
PATCH http://localhost:8000/site/60f7d4ccf82e4e06fc36eb0d
Content-Type: application/json
{
    "site_label": "New Label",
    "site_address": "456 Elm St"
}
"""
@site_router.patch("/{site_id}")
async def update_site_api(site_id: str, update_data: Dict[str, str], db: AsyncIOMotorClient = Depends(get_db)):
    # Validate homeowner_id if present in the update_data
    if "homeowner_id" in update_data:
        if isinstance(update_data["homeowner_id"], str):
            try:
                update_data["homeowner_id"] = ObjectId(update_data["homeowner_id"])
            except:
                raise HTTPException(status_code=400, detail="Invalid ObjectId for homeowner_id")

    success = await update_site_service(site_id, update_data, db)
    if success:
        return {"message": "Site updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Site not found or not updated")



# API to delete (soft-delete) a site
# DELETE http://localhost:8000/site/60f7d4ccf82e4e06fc36eb0d
@site_router.delete("/{site_id}")
async def delete_site_api(site_id: str, db: AsyncIOMotorClient = Depends(get_db)):
    success = await delete_site_service(site_id, db)
    if success:
        return {"message": "Site deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Site not found or not deleted")

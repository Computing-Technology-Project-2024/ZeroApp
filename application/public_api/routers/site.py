from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Dict
from bson import ObjectId
from public_api.services.ecx_api import fetch_sites
from public_api.schemas.site import Site, SiteList
from public_api.data_access.site_repository import update_all_sites, get_site, get_all_sites_from_db, add_site, update_site, disable_site
from public_api.database import get_db

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

@site_router.get("/{site_id}")
async def get_site_by_id(site_id: str):
    db = get_db()
    # Needs authentication and/or authorization here or in repo side
    site = await get_site(site_id, db)
    return site

@site_router.post("/")
async def add_new_site(site: Site):
    db = get_db()
    site = await add_site(site, db)
    return site

#Call bottom function first
@site_router.patch("/renew-sites-ecx")
async def renew_all_sites_route(authentication: dict):
    result = await renew_all_sites(authentication)
    return result

@site_router.patch("/{site_object_id}")
async def update_site_data(site_object_id: str, update_data: dict):
    db = get_db()
    updated_site = await update_site(site_object_id, update_data, db)
    return updated_site

@site_router.delete("/{site_object_id}")
async def delete_site(site_object_id: str):
    db = get_db()
    result = await disable_site(site_object_id, db)
    return result

# Admin only functions
async def renew_all_sites(authentication: dict):
    db = get_db()
    # this is a big function so extra authentication (typing password or a code) would be useful. For now just code "update all"
    if authentication["code"] != "update all":
        return 0

    sites = await get_all_sites_from_ecx()
    result = await update_all_sites(sites, db)

    return result

@site_router.get("/") # Add filter to body of request
async def get_all_sites(filt: dict):
    # Example filter = {"homeowner_id":null} to find sites without homeowners
    db = get_db()
    sites = await get_all_sites_from_db(filt, db)
    return sites

# helpers
async def get_all_sites_from_ecx():
    sites_list = await fetch_sites()
    return SiteList(sites=[Site(**site) for site in sites_list])

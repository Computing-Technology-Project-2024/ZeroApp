from fastapi import APIRouter
from public_api.services.ecx_api import fetch_sites
from public_api.schemas.site import Site, SiteList
from public_api.data_access.site_repository import update_all_sites, get_site, get_all_sites_from_db
from public_api.database import get_db
from bson.objectid import ObjectId

site_router = APIRouter(
    prefix="/sites",
    tags=["site"],
)

@site_router.get("/{site_id}")
async def get_site_by_id(site_id: str):
    db = get_db()
    # Needs authentication and/or authorization here or in repo side
    site = await get_site(site_id, db)
    return site

@site_router.post("/")
async def add_new_site():
    pass

@site_router.patch("/")
async def update_site_data():
    db = get_db()
    pass


# Admin only functions
@site_router.patch("/renew-sites-ecx")
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
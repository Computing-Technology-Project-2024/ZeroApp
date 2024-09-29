from fastapi import APIRouter
from public_api.services.ecx_api import fetch_sites
from public_api.schemas.site import Site, SiteList
from public_api.data_access.site_repository import update_all_sites
from public_api.database import get_db

site_router = APIRouter(
    prefix="/sites",
    tags=["site"],
)

@site_router.get("/{site_id}")
async def get_site_by_id():
    pass

@site_router.post("/")
async def add_new_site():
    pass

@site_router.patch("/")
async def update_site_data():
    pass


@site_router.patch("/renew-sites-ecx")
async def renew_all_sites(authentication: dict):
    db = get_db()
    # this is a big function so extra authentication (typing password or a code) would be useful. For now just code "update all"
    if authentication["code"] != "update all":
        return 0

    sites = await get_all_sites()
    result = await update_all_sites(sites, db)

    return result



# helpers
async def get_all_sites():
    sites_list = await fetch_sites()
    return SiteList(sites=[Site(**site) for site in sites_list])
from fastapi import APIRouter

site_router = APIRouter(
    prefix="/sites",
    tags=["site"],
)

@site_router.get("/")
async def get_all_sites():
    pass

@site_router.get("/{site_id}")
async def get_site_by_id():
    pass

@site_router.post("/")
async def add_new_site():
    pass

@site_router.patch("/")
async def update_site_data():
    pass

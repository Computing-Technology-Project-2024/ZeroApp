from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient

from public_api.data_access.homeowner_repository import (
    add_homeowner,
    get_homeowner_by_id,
    update_homeowner,
    disable_homeowner
)
from public_api.database import get_db
from public_api.schemas.homeowner import HomeOwner

homeowner_router = APIRouter(
    prefix="/homeowner",
    tags=["homeowner"]
)

# TODO: add exception handling here
@homeowner_router.get("/{homeowner_id}")
async def get_homeowner_account_by_id(homeowner_id: str, db: AsyncIOMotorClient = Depends(get_db)):
    homeowner = await get_homeowner_by_id(homeowner_id, db)
    return homeowner

@homeowner_router.post("/")
async def create_homeowner(homeowner: HomeOwner, db: AsyncIOMotorClient = Depends(get_db)):
    homeowner = await add_homeowner(homeowner, db)
    return 1  # Could have proper error handling

@homeowner_router.patch("/{homeowner_id}")
async def patch_homeowner(homeowner_id: str, update_data: dict, db: AsyncIOMotorClient = Depends(get_db)):
    updated_homeowner = await update_homeowner(homeowner_id, update_data, db)
    return updated_homeowner

@homeowner_router.delete("/{homeowner_id}")
async def delete_homeowner(homeowner_id: str, db: AsyncIOMotorClient = Depends(get_db)):
    result = await disable_homeowner(homeowner_id, db)
    return result

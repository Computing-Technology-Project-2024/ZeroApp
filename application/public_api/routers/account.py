from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient

from ..data_access.account_repository import (
    add_account,
    get_account_by_id as get_account_by_id_from_db,
    update_account,
    remove_account
)
from ..data_access.homeowner_repository import add_homeowner
from ..database import get_db
from ..schemas.homeowner import HomeOwner
from ..schemas.account import Account

account_router = APIRouter(
    prefix="/account",
    tags=["account"]
)

@account_router.get("/{account_id}")
async def get_account_by_id(account_id: str, db: AsyncIOMotorClient = Depends(get_db)):
    account = await get_account_by_id_from_db(account_id, db)
    return account


# restrict this one for now
# @account_router.post("/")
async def create_account(account: Account, homeowner_dict: dict, db: AsyncIOMotorClient = Depends(get_db)):
    account = await add_account(account, db)
    homeowner_dict["account_id"] = account.id
    homeowner = HomeOwner(**homeowner_dict)
    homeowner = await add_homeowner(homeowner, db)
    return 1  # Could have proper error handling and wrap in transaction

@account_router.patch("/{account_id}")
async def patch_account(account_id: str, update_data: dict, db: AsyncIOMotorClient = Depends(get_db)):
    updated_account = await update_account(account_id, update_data, db)
    return updated_account

@account_router.delete("/{account_id}")
async def delete_account(account_id: str, db: AsyncIOMotorClient = Depends(get_db)):
    result = await remove_account(account_id, db)
    return result

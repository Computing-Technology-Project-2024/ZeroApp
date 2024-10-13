from typing import Optional

from bson.objectid import ObjectId
from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from public_api.database import get_db
from public_api.schemas.account import Account, Role

async def add_account(account: Account, db: AsyncIOMotorDatabase) -> Account:
    new_id = ObjectId()
    account_dict = account.model_dump(by_alias=True)
    account_dict['_id'] = new_id
    await db["accounts"].insert_one(account_dict)
    return Account(**account_dict)

async def get_account_by_id(admin_id: str, db: AsyncIOMotorDatabase) -> Optional[Account]:
    account = await db["accounts"].find_one({"_id": ObjectId(admin_id)})
    return Account(**account) if account else None

async def get_account_by_email(email: str, db: AsyncIOMotorDatabase) -> Optional[Account]:
    account = await db["accounts"].find_one({"email": email})
    return Account(**account) if account else None

async def get_all_admins(db: AsyncIOMotorDatabase) -> list[Account]:
    admins = await db["accounts"].find({"role": Role.ADMIN}).to_list(length=100)
    return [Account(**admin) for admin in admins]

async def remove_account(account_id: str, db: AsyncIOMotorDatabase) -> bool:
    result = await db["accounts"].delete_one({"_id": ObjectId(account_id)})
    return result.deleted_count == 1

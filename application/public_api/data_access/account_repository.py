from typing import Optional

from bson.objectid import ObjectId
from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from public_api.database import get_db
from public_api.schemas.account import Account, Role

async def add_account(account: Account, db: AsyncIOMotorDatabase) -> Account:
    result = await db["accounts"].insert_one(account.dict(by_alias=True))
    return Account(**account.dict(by_alias=True, _id=result.inserted_id))

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

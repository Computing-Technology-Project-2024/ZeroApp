from typing import Optional
from bson.objectid import ObjectId
from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from public_api.database import get_db
from public_api.schemas.account import Account, Role


async def add_account(account: Account, db: AsyncIOMotorDatabase) -> Account:    
    if account.id is None:
        account.id = ObjectId()
    account_dict = account.model_dump(by_alias=True)
    result = await db["accounts"].insert_one(account_dict)
    return Account(**account_dict, id=result.inserted_id)

async def add_new_account_to_db_second_ver(account_data: dict, db: AsyncIOMotorDatabase) -> str:
    result = await db["accounts"].insert_one(account_data)
    return str(result.inserted_id)

async def get_account_by_id(account_id: str, db: AsyncIOMotorDatabase) -> Optional[Account]:
    account = await db["accounts"].find_one({"_id": ObjectId(account_id)})
    return Account(**account) if account else None

async def get_account_by_email(email: str, db: AsyncIOMotorDatabase) -> Optional[Account]:
    account = await db["accounts"].find_one({"email": email})
    return Account(**account) if account else None

async def get_all_admins(db: AsyncIOMotorDatabase) -> list[Account]:
    admins = await db["accounts"].find({"role": Role.ADMIN.value}).to_list(length=100)
    return [Account(**admin) for admin in admins]

async def update_account_by_id(account_id: str, update_data: dict, db) -> bool:
    result = await db["accounts"].update_one(
        {"_id": ObjectId(account_id)},
        {"$set": update_data}    
    )
    return result.modified_count == 1

async def remove_account(account_id: str, db: AsyncIOMotorDatabase) -> bool:
    result = await db["accounts"].update_one(
        {"_id": ObjectId(account_id)}, 
        {"$set": {"deleted": True}}
    )
    return result.modified_count == 1

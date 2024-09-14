from typing import Optional

from bson.objectid import ObjectId
from fastapi import Depends

from public_api.database import get_collection
from public_api.schemas.account import Account, Role

async def add_account(account: Account, db=Depends(get_collection("accounts"))) -> Account:
    result = await db.insert_one(account.dict(by_alias=True))
    return Account(**account.dict(by_alias=True, _id=result.inserted_id))

async def get_account_by_id(admin_id: str, db=Depends(get_collection("accounts"))) -> Optional[Account]:
    account = await db.find_one({"_id": ObjectId(admin_id)})
    return Account(**account) if account else None

async def get_account_by_email(email: str, db=Depends(get_collection("accounts"))) -> Optional[Account]:
    account = await db.find_one({"email": email})
    return Account(**account) if account else None

async def get_all_admins(db=Depends(get_collection("accounts"))) -> list[Account]:
    admins = await db.find({"role": Role.ADMIN}).to_list(length=100)
    return [Account(**admin) for admin in admins]

async def remove_account(account_id: str, db=Depends(get_collection("accounts"))) -> bool:
    result = await db.delete_one({"_id": ObjectId(account_id)})
    return result.deleted_count == 1

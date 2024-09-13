from typing import Optional

from bson.objectid import ObjectId

from public_api.database import get_collection
from public_api.schemas.account import Account, Role


async def add_admin(account: Account) -> Account:
    result = await get_collection("accounts").insert_one(account.dict(by_alias=True))
    return Account(**account.dict(by_alias=True, _id=result.inserted_id))

async def get_all_admins(db) -> list[Account]:
    admins = await get_collection("accounts").find({"role": Role.ADMIN}).to_list(length=100)
    return [Account(**admin) for admin in admins]

async def get_admin_by_id(db, admin_id: str) -> Optional[Account]:
    admin = await get_collection("accounts").find_one({"_id": ObjectId(admin_id), "role": Role.ADMIN})
    return Account(**admin) if admin else None

async def remove_admin(db, admin_id: str) -> bool:
    result = await get_collection("accounts").delete_one({"_id": ObjectId(admin_id), "role": Role.ADMIN})
    return result.deleted_count == 1

from motor.motor_asyncio import AsyncIOMotorClient
from schemas.account import Account, Role
from bson import ObjectId

async def add_admin(db, account: Account) -> Account:
    result = await db.get_collection("accounts").insert_one(account.dict(by_alias=True))
    return Account(**account.dict(by_alias=True, _id=result.inserted_id))

async def get_all_admins(db) -> list[Account]:
    admins = await db.get_collection("accounts").find({"role": Role.ADMIN}).to_list(length=100)
    return [Account(**admin) for admin in admins]

async def get_admin_by_id(db, admin_id: str) -> Optional[Account]:
    admin = await db.get_collection("accounts").find_one({"_id": ObjectId(admin_id), "role": Role.ADMIN})
    return Account(**admin) if admin else None

async def remove_admin(db, admin_id: str) -> bool:
    result = await db.get_collection("accounts").delete_one({"_id": ObjectId(admin_id), "role": Role.ADMIN})
    return result.deleted_count == 1

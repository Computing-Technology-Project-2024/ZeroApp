from motor.motor_asyncio import AsyncIOMotorClient
from data_access.models.admin import Admin
from bson import ObjectId

async def add_admin(db, admin: Admin) -> Admin:
    result = await db.get_collection("admins").insert_one(admin.dict(by_alias=True))
    return Admin(**admin.dict(by_alias=True, _id=result.inserted_id))

async def get_all_admins(db) -> list[Admin]:
    admins = await db.get_collection("admins").find().to_list(length=100)
    return [Admin(**admin) for admin in admins]

async def get_admin_by_id(db, admin_id: str) -> Optional[Admin]:
    admin = await db.get_collection("admins").find_one({"_id": ObjectId(admin_id)})
    return Admin(**admin) if admin else None

async def remove_admin(db, admin_id: str) -> bool:
    result = await db.get_collection("admins").delete_one({"_id": ObjectId(admin_id)})
    return result.deleted_count == 1

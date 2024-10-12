from typing import Optional
from ..utils.security import hash_password
from bson import ObjectId

from public_api.data_access.account_repository import (
    add_account as add_admin_repo,
    get_all_admins as get_all_admins_repo,
    get_account_by_id as get_admin_by_id_repo,
    remove_account as remove_admin_repo,
    get_account_by_email, update_account_by_id,
)

from public_api.schemas.account import Account, Role
from public_api.utils.security import hash_password

async def add_new_account(username: str, email: str, mobile_number: str, password: str, is_admin: bool, db) -> Account:
    password_hash = hash_password(password)
    admin_account = Account(
        username=username,
        email=email,
        mobile_number=mobile_number,
        password_hash=password_hash,
        role=Role.ADMIN if is_admin else Role.DEFAULT,
        deleted=False
    )
    return await add_admin_repo(admin_account, db)

# async def add_new_account_service(account_data: dict, db):
#     existing_account = await db["accounts"].find_one({"email": account_data["email"]})
#     if existing_account:
#         raise ValueError("An account with this email already exists")
#     if "password" in account_data:
#         account_data["password_hash"] = hash_password(account_data.pop("password"))
#
#     # Auto-generate ObjectId for new account
#     account_data["_id"] = ObjectId()
#
#     account_id = await add_new_account_to_db_second_ver(account_data, db)
#     return account_id

async def get_all_admins(db) -> list[Account]:
    return await get_all_admins_repo(db)

async def get_account_using_email(email: str, db) -> Account | None:
    return await get_account_by_email(email, db)

async def get_account_using_id(id: str, db) -> Account | None:
    return await get_admin_by_id_repo(id, db)

async def update_account(account_id: str, update_data: dict, db) -> Optional[bool]:
    if not update_data:
        raise ValueError("No data provided for update")
    return await update_account_by_id(account_id, update_data, db)

async def remove_account(account_id: str, db) -> bool:
    return await remove_admin_repo(account_id, db)

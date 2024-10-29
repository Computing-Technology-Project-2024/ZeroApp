from typing import Optional
from bson.objectid import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase
from public_api.schemas.account import Account, Role
from public_api.data_access.site_repository import assign_sites
import string
import secrets

async def add_account(account: Account, db: AsyncIOMotorDatabase) -> Account:
    account_dict = account.model_dump(by_alias=True, exclude=["id"])

    # Insert the homeowner into the collection
    result = await db["accounts"].insert_one(account_dict)

    return Account(**account_dict, id=result.inserted_id)

async def get_account_by_id(account_id: str, db: AsyncIOMotorDatabase) -> Account:
    account = await db["accounts"].find_one({
        # can add where homeowner == session.homeowner or is admin for authorization
        "_id": ObjectId(account_id),
        "deleted": False
    })
    return Account(**account) if account else None

async def get_account_by_email(email: str, db: AsyncIOMotorDatabase) -> Optional[Account]:
    account = await db["accounts"].find_one({"email": email})
    return Account(**account) if account else None

async def get_all_admins(db: AsyncIOMotorDatabase) -> list[Account]:
    admins = await db["accounts"].find({"role": Role.ADMIN.value}).to_list(length=100)
    return [Account(**admin) for admin in admins]

async def remove_account(account_object_id: str, db: AsyncIOMotorDatabase):
    account = await db["accounts"].find_one({
        "_id": ObjectId(account_object_id),
        "deleted": False
    })

    if account is None:
        return 0
    else:
        account["deleted"] = True

    Account(**account)

    result = await db["accounts"].update_one(
        {"_id": ObjectId(account_object_id)},
        {"$set": account}
    )

    if result.modified_count == 0:
        return 0
    else:
        return 1


async def update_account(account_object_id: str, account_data: dict, db: AsyncIOMotorDatabase) -> Account:
    account = await db["accounts"].find_one({
        "_id": ObjectId(account_object_id),
        "deleted": False
    })

    if account is None:
        return 0
    else:
        for k, v in account_data.items():
            account[k] = v

    Account(**account)

    result = await db["accounts"].update_one(
        {"_id": ObjectId(account_object_id)},
        {"$set": account}
    )

    if result.modified_count == 0:
        return 0

    updated_account = await db["accounts"].find_one({"_id": ObjectId(account_object_id)})

    return Account(**updated_account)

async def create_account_shell(account_info: Account, site_ids: dict, db: AsyncIOMotorDatabase) -> str:
    
    tries = 5

    alphabet = string.ascii_letters + string.digits

    error = ""

    while tries > 0:
        
        auth_code = ''.join(secrets.choice(alphabet) for i in range(12))
    
        account_info.authorization_code = auth_code
        account = account_info.model_dump(by_alias=True, exclude=["id"])

        try:
            result = await db["accounts"].insert_one(account)
            new_account = Account(**account, id=result.inserted_id)
            new_account_id = new_account.id
            res = await assign_sites(new_account_id, site_ids, db)
            if (res==1):
                return new_account.authorization_code
            else:
                return "Account creation error"
        except Exception as e:
            if "duplicate key error" in str(e):
                tries = tries - 1
                continue
            else:
                return e

    return "Account creation error"
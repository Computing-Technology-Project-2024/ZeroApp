from public_api.data_access.admin_repository import add_admin as add_admin_repo, get_all_admins as get_all_admins_repo, get_admin_by_id as get_admin_by_id_repo, remove_admin as remove_admin_repo
from public_api.schemas.account import Account, Role
from public_api.utils.security import hash_password

async def add_admin(db, username: str, email: str, mobile_number: str, password: str) -> Account:
    password_hash = hash_password(password)
    admin_account = Account(
        username=username,
        email=email,
        mobile_number=mobile_number,
        password_hash=password_hash,
        role=Role.ADMIN,
        deleted=False
    )
    return await add_admin_repo(db, admin_account)

async def get_all_admins(db) -> list[Account]:
    return await get_all_admins_repo(db)

async def get_admin_by_id(db, admin_id: str) -> Account:
    admin = await get_admin_by_id_repo(db, admin_id)
    if not admin:
        raise ValueError("Admin not found")
    return admin

async def remove_admin(db, admin_id: str) -> bool:
    return await remove_admin_repo(db, admin_id)

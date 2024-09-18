from public_api.data_access.account_repository import (
    add_account as add_admin_repo,
    get_all_admins as get_all_admins_repo,
    get_account_by_id as get_admin_by_id_repo,
    remove_account as remove_admin_repo,
    get_account_by_email,
)

from public_api.schemas.account import Account, Role
from public_api.utils.security import hash_password

async def add_new_account(username: str, email: str, mobile_number: str, password: str, db) -> Account:
    password_hash = hash_password(password)
    admin_account = Account(
        username=username,
        email=email,
        mobile_number=mobile_number,
        password_hash=password_hash,
        role=Role.ADMIN,
        deleted=False
    )
    return await add_admin_repo(admin_account, db)

async def get_all_admins(db) -> list[Account]:
    return await get_all_admins_repo(db)

async def get_account_using_email(email: str, db) -> Account | None:
    return await get_account_by_email(email, db)

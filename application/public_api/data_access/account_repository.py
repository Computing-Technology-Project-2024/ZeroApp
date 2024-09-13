from typing import Optional

from public_api.database import get_db, get_collection
from public_api.schemas.account import Account, Role


async def get_all_accounts() -> list[Account]:
    accounts = await get_collection("accounts").find({}).to_list(length=100)
    return [Account(**account) for account in accounts]

async def get_account_by_email(email: str) -> Optional[Account]:
    account = await get_collection("accounts").find_one({"email": email})
    return Account(**account) if account else None


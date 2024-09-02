from data_access.repositories.admin_repository import add_admin as add_admin_repo, get_all_admins as get_all_admins_repo, get_admin_by_id as get_admin_by_id_repo, remove_admin as remove_admin_repo
from schemas.admin import AdminCreate, AdminResponse
from utils.security import hash_password
from data_access.models.admin import Admin

async def add_admin(db, admin_data: AdminCreate) -> AdminResponse:
    admin_data.password = hash_password(admin_data.password)
    admin = Admin(**admin_data.dict())
    new_admin = await add_admin_repo(db, admin)
    return AdminResponse.from_orm(new_admin)

async def get_all_admins(db) -> list[AdminResponse]:
    admins = await get_all_admins_repo(db)
    return [AdminResponse.from_orm(admin) for admin in admins]

async def get_admin_by_id(db, admin_id: str) -> AdminResponse:
    admin = await get_admin_by_id_repo(db, admin_id)
    if not admin:
        raise ValueError("Admin not found")
    return AdminResponse.from_orm(admin)

async def remove_admin(db, admin_id: str) -> bool:
    return await remove_admin_repo(db, admin_id)

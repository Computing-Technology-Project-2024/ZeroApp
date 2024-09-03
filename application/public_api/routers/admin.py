from fastapi import APIRouter

admin_router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

@admin_router.get("/admin-accounts")
async def get_all_admin_accounts():
    pass

@admin_router.get("/admin-accounts/{account_id}")
async def get_admin_account_by_id():
    pass

@admin_router.post("/admin-accounts")
async def add_new_admin_account():
    pass

@admin_router.patch("/admin-accounts")
async def update_admin_account():
    pass

@admin_router.delete("/admin-accounts")
async def delete_admin_account():
    pass

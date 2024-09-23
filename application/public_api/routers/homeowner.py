from fastapi import APIRouter
from public_api.data_access.account_repository import get_acc
from public_api.data_access.homeowner_repository import add_homeowner
from public_api.database import get_db
from public_api.schemas.homeowner import HomeOwner, HomeOwnerDetails, HomeOwnerAddress
import datetime

homeowner_router = APIRouter(
    prefix="/homeowner",
    tags=["homeowner"]
)

@homeowner_router.get("/")
async def get_homeowner():
    db = get_db() #Testing
    resp = await get_acc(db)
    return resp

@homeowner_router.get("/{account_id}")
async def get_homeowner_account_by_id():
    pass

@homeowner_router.post("/")
async def create_homeowner(homeowner: HomeOwner):
    db = get_db()
    homeowner = await add_homeowner(homeowner, db)
    return 1  #Could have proper error handling

@homeowner_router.patch("/")
async def update_homeowner():
    pass

@homeowner_router.delete("/")
async def delete_homeowner():
    pass


def main():
    print("Hello")

if __name__ == "__main__":
    main()

from fastapi import APIRouter
from data_access.homeowner_repository import UserRepository

homeowner_router = APIRouter(
    prefix="/homeowner",
    tags=["homeowner"]
)

@homeowner_router.get("/")
async def get_homeowner():
    return {"hello": "worldwide"}

@homeowner_router.get("/{account_id}")
async def get_homeowner_account_by_id():
    return UserRepository.get_homeowner(account_id)
    pass

@homeowner_router.post("/")
async def create_homeowner():
    homeowner = {}
    return UserRepository.create_homeowner(homeowner)
    pass

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

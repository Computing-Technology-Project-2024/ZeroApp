from motor.motor_asyncio import AsyncIOMotorClient
from data_access.models.user import User
from bson import ObjectId

class UserRepository:

    def __init__(self, db):
        self.collection = db.get_collection("users")

    async def get_user(self, user_id: str) -> User:
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        return User(**user) if user else None

    async def get_user_by_username(self, username: str) -> User:
        user = await self.collection.find_one({"username": username})
        return User(**user) if user else None

    async def create_user(self, user: User) -> User:
        result = await self.collection.insert_one(user.dict(by_alias=True))
        return User(**user.dict(by_alias=True, _id=result.inserted_id))

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import DATABASE_URL, DATABASE_NAME

# Initialize Motor client with the connection string
client = AsyncIOMotorClient(DATABASE_URL)

def get_db() -> AsyncIOMotorDatabase:
    return client[DATABASE_NAME]


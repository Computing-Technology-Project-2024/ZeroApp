from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import MONGO_DETAILS, DATABASE_NAME

# Test getting the env variables from config
print(f"MONGO URL: {MONGO_DETAILS}")
print(f"DATABASE_NAME Key: {DATABASE_NAME}")


# Initialize Motor client with the connection string
client = AsyncIOMotorClient(MONGO_DETAILS)

def get_db() -> AsyncIOMotorDatabase:
    try:
        db = client[DATABASE_NAME]
        yield db
    finally:
        client.close()

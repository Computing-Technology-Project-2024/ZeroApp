from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from config import DATABASE_URL, DATABASE_NAME

# Test getting the env variables from config
print(f"MONGO URL: {DATABASE_URL}")
print(f"DATABASE_NAME Key: {DATABASE_NAME}")


# Initialize Motor client with the connection string
client = AsyncIOMotorClient(DATABASE_URL)

def get_db() -> AsyncIOMotorDatabase:
    try:
        db = client[DATABASE_NAME]
        yield db
    finally:
        client.close()

def get_collection(name: str):
    return get_db[name]


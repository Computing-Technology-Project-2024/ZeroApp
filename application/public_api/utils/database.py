from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId

MONGO_DETAILS = "mongodb://localhost:27017"

client = None
db = None

async def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGO_DETAILS)
    db = client.my_database  # Replace 'my_database' with your database name

async def close_mongo_connection():
    client.close()

def get_collection(name: str):
    return db[name]

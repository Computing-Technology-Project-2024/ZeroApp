from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

# TODO: implement dotenv
MONGO_DETAILS = "mongodb+srv://username:password*@test.sxv1i.mongodb.net/?retryWrites=true&w=majority&appName=Test"
DATABASE_NAME = "the database name"

# Initialize Motor client with the connection string
client = AsyncIOMotorClient(MONGO_DETAILS)

def get_db() -> AsyncIOMotorDatabase:
    try:
        db = client[DATABASE_NAME]
        yield db
    finally:
        client.close()

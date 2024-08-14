# # python -m uvicorn main:app --reload

from fastapi import FastAPI, APIRouter
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
from pydantic import BaseModel, Field

app = FastAPI()
router = APIRouter()

# mongodb atlas connection string
MONGO_DETAILS = "mongodb+srv://phuongtamk51:PhuongT16120*@test.sxv1i.mongodb.net/?retryWrites=true&w=majority&appName=Test"

# Initialize Motor client with the connection string
client = AsyncIOMotorClient(MONGO_DETAILS)
# database testing sample
db = client.sample_mflix

# Define a Pydantic model to represent the data structure
class User(BaseModel):
    id: str
    name: str
    email: str
    password: str

# Helper function to convert ObjectId to string
def user_serializer(user) -> dict:
    return {
        "id": str(user["_id"]),  # Convert ObjectId to string
        "name": user["name"],
        "email": user["email"],
        "password": user["password"]
    }


#default test
@app.get("/")
def ping():
    return {"Hello": "World"}

#test return users list
@router.get("/users/", response_model=List[User])
async def get_all_users():
    users_cursor = db.users.find({})
    users = await users_cursor.to_list(length=100)  # Adjust the length as needed
    return [user_serializer(user) for user in users]


app.include_router(router)

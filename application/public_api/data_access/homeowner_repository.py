from typing import Optional

from bson.objectid import ObjectId
from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase

from pydantic import BaseModel, Field

from public_api.database import get_db
from public_api.schemas.homeowner import HomeOwner

async def add_homeowner(homeowner: HomeOwner, db: AsyncIOMotorDatabase) -> HomeOwner:
    
    homeowner_dict = homeowner.model_dump(by_alias=True, exclude=["id"])

    # Insert the homeowner into the collection
    result = await db["homeowners"].insert_one(homeowner_dict)

    return HomeOwner(**homeowner_dict, id=result.inserted_id)

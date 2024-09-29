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

async def get_homeowner_by_id(homeowner_id: str, db: AsyncIOMotorDatabase):
    homeowner = await db["homeowners"].find_one({
        "_id": ObjectId(homeowner_id),
        "active": True
    })
    return HomeOwner(**homeowner) if homeowner else None

async def update_homeowner(homeowner_id: str, homeowner_data: dict, db: AsyncIOMotorDatabase) -> HomeOwner:
    homeowner = await db["homeowners"].find_one({
        "_id": ObjectId(homeowner_id),
        "active": True
    })

    if homeowner is None:
        return 0
    else:
        # Test if update is in sub dict
        for k, v in homeowner_data.items():
            try:
                subdict_update = homeowner_data[k].items()
            except (AttributeError, TypeError):
                homeowner[k] = v
            else:
                print(homeowner[k])
                for subdictu_k, subdictu_v in subdict_update:
                    homeowner[k][subdictu_k] = subdictu_v
                
    HomeOwner(**homeowner)

    result = await db["homeowners"].update_one(
        {"_id": ObjectId(homeowner_id)},
        {"$set": homeowner}
    )

    if result.modified_count == 0:
        return 0

    updated_homeowner = await db["homeowners"].find_one({"_id": ObjectId(homeowner_id)})

    return HomeOwner(**updated_homeowner)

async def disable_homeowner(homeowner_id: str, db: AsyncIOMotorDatabase):
    homeowner = await db["homeowners"].find_one({
        "_id": ObjectId(homeowner_id),
        "active": True
    })

    if homeowner is None:
        return 0
    else:
        homeowner["active"] = False
                
    HomeOwner(**homeowner)

    result = await db["homeowners"].update_one(
        {"_id": ObjectId(homeowner_id)},
        {"$set": homeowner}
    )

    if result.modified_count == 0:
        return 0

    updated_homeowner = await db["homeowners"].find_one({"_id": ObjectId(homeowner_id)})

    if updated_homeowner["active"] == False:
        return 1
    else:
        return 0

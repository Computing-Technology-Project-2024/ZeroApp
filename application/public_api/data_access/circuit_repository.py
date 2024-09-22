from fastapi import Depends
from bson.objectid import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from public_api.schemas.circuit import Circuit

async def get_circuit(circuit_id: str, db: AsyncIOMotorDatabase) -> Circuit:
    circuit = await db["circuits"].find_one({"_id": ObjectId(circuit_id)})
    return Circuit(**circuit) if circuit else None

async def create_circuit(circuit: Circuit, db: AsyncIOMotorDatabase) -> Circuit:
    result = await db["circuits"].insert_one(circuit.dict(by_alias=True))
    return Circuit(**circuit.dict(by_alias=True, _id=result.inserted_id))

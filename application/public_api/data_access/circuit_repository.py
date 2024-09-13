from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson.objectid import ObjectId

from public_api.database import get_db
from public_api.schemas.circuit import Circuit

class CircuitRepository:

    def __init__(self, db: AsyncIOMotorDatabase = Depends(get_db)):
        self.collection = db.get_collection("circuits")

    async def get_circuit(self, circuit_id: str) -> Circuit:
        circuit = await self.collection.find_one({"_id": ObjectId(circuit_id)})
        return Circuit(**circuit) if circuit else None

    async def create_circuit(self, circuit: Circuit) -> Circuit:
        result = await self.collection.insert_one(circuit.dict(by_alias=True))
        return Circuit(**circuit.dict(by_alias=True, _id=result.inserted_id))

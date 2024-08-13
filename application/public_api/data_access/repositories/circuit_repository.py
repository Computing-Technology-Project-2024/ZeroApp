from motor.motor_asyncio import AsyncIOMotorClient
from data_access.models.circuit import Circuit
from bson import ObjectId

class CircuitRepository:

    def __init__(self, db):
        self.collection = db.get_collection("circuits")

    async def get_circuit(self, circuit_id: str) -> Circuit:
        circuit = await self.collection.find_one({"_id": ObjectId(circuit_id)})
        return Circuit(**circuit) if circuit else None

    async def create_circuit(self, circuit: Circuit) -> Circuit:
        result = await self.collection.insert_one(circuit.dict(by_alias=True))
        return Circuit(**circuit.dict(by_alias=True, _id=result.inserted_id))

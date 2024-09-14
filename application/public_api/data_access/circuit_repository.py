from fastapi import Depends
from bson.objectid import ObjectId

from public_api.database import get_collection
from public_api.schemas.circuit import Circuit

async def get_circuit(circuit_id: str, db=Depends(get_collection("circuits"))) -> Circuit:
    circuit = await db.find_one({"_id": ObjectId(circuit_id)})
    return Circuit(**circuit) if circuit else None

async def create_circuit(circuit: Circuit, db=Depends(get_collection("circuits"))) -> Circuit:
    result = await db.insert_one(circuit.dict(by_alias=True))
    return Circuit(**circuit.dict(by_alias=True, _id=result.inserted_id))

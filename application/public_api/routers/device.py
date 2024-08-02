from fastapi import APIRouter

device_router = APIRouter(
    prefix="/devices",
    tags=["device"]
)

@device_router.get("/")
async def get_all_devices():
    pass

@device_router.get("/{site_id}")
async def get_device_by_id():
    pass

@device_router.post("/")
async def add_new_device():
    pass

@device_router.patch("/")
async def update_device_data():
    pass

@device_router.delete("/")
async def delete_device():
    pass

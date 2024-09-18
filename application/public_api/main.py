from fastapi import FastAPI

from routers.admin import admin_router
from routers.analytic import analytic_router
from routers.auth import auth_router
from routers.device import device_router
from routers.site import site_router
from routers.homeowner import homeowner_router

app = FastAPI()

@app.get("/")
def ping():
    return {"Hello": "World"}


app.include_router(admin_router)
app.include_router(auth_router)
app.include_router(analytic_router)
app.include_router(device_router)
app.include_router(site_router)
app.include_router(homeowner_router)

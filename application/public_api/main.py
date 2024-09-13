import os

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from routers.admin import admin_router
from routers.analytic import analytic_router
from routers.auth import auth_router
from routers.device import device_router
from routers.site import site_router

app = FastAPI()

@app.get("/")
def ping():
    return {"Hello": "World"}

ENV = os.getenv("ENVIRONMENT", "local")

# set CORS origins based on the environment
if ENV == "production":
    origins = [
        "https://our-domain.com",
    ]
else:
    origins = [
        "http://localhost:3000",
    ]

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(admin_router)
app.include_router(auth_router)
app.include_router(analytic_router)
app.include_router(device_router)
app.include_router(site_router)

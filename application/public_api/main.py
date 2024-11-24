import os
import httpx

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from public_api.routers.admin import admin_router
from public_api.routers.analytic import analytic_router
from public_api.routers.auth import auth_router
from public_api.routers.device import device_router
from public_api.routers.site import site_router
from public_api.routers.account import account_router
from public_api.routers.enphase import enphase_router

from public_api.routers.homeowner import homeowner_router
from public_api.routers.account import account_router

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

# app.include_router(admin_router)
app.include_router(auth_router)
app.include_router(analytic_router)
app.include_router(device_router)
# app.include_router(site_router)
app.include_router(account_router)
app.include_router(enphase_router)
app.include_router(homeowner_router)
app.include_router(account_router)

# Endpoint to proxy requests
@app.get("/proxy/enphase")
async def proxy_enphase():
    # Enphase API URL
    api_url = 'https://api.enphaseenergy.com/api/v4/systems/1935668/energy_export_telemetry?key=e2c98c826a5031d395ba7e57b9ac03f8&start_date=2024-02-02'

    # Bearer token (replace with your actual token)
    bearer_token = 'eyJhbGciOiJSUzI1NiJ9.eyJhcHBfdHlwZSI6InN5c3RlbSIsInVzZXJfbmFtZSI6Im1tYWxhbUBzd2luLmVkdS5hdSIsImVubF9jaWQiOiIiLCJlbmxfcGFzc3dvcmRfbGFzdF9jaGFuZ2VkIjoiMTcwOTY5NTczMSIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJjbGllbnRfaWQiOiJlM2E5MWE3MjhiZmI1YmIwMjBiZDAwZGQ4MjAyNzY4ZSIsImF1ZCI6WyJvYXV0aDItcmVzb3VyY2UiXSwiaXNfaW50ZXJuYWxfYXBwIjpmYWxzZSwic2NvcGUiOlsicmVhZCIsIndyaXRlIl0sImV4cCI6MTczMjQ5MDM1NiwiZW5sX3VpZCI6IjIyMTI2MjYiLCJhcHBfSWQiOiIxNDA5NjI0NTY1MDcyIiwianRpIjoiZWY4NTAwNzktMzVhYi00NmIwLWE5ODctNDY0NTNjNWM2MWZhIn0.Ia_xOWD76zQ3Nl-GrZKCx1oDtGdmDTg1emxV7cziI5u3IfgxYfBkOtiXDmYCo1XN8ll1bvJX937WrSd-Dfj2uNSjouZw-k7tOv7A6tF7leMMpxorj_Hwyyg0jxa9J35YBOQUbC6S_StKfsH27DefNBh4LmEr9RpXcB_ovrpaHsc'

    # Set up the headers to include the Authorization Bearer token
    headers = {
        "Authorization": f"Bearer {bearer_token}",
    }

    # Make the request to the Enphase API
    async with httpx.AsyncClient() as client:
        response = await client.get(api_url, headers=headers)

    # Return the response from the Enphase API directly
    return JSONResponse(content=response.json(), status_code=response.status_code)


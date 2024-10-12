import base64
from fastapi import APIRouter
import requests

enphase_router = APIRouter(
    prefix="/enphase",
    tags=["enphase"]
)

# GET http://127.0.0.1:8000/enphrase/get-code (POSTMAN)
@enphase_router.post("/get-token")
def get_token(code: str):
        token_url = 'https://api.enphaseenergy.com/oauth/token'

        client_id = 'e3a91a728bfb5bb020bd00dd8202768e'
        client_secret = '17915396d4ee5439210dc3c52130cb3d'

        auth_string = f"{client_id}:{client_secret}"
        auth_bytes = auth_string.encode('ascii')
        auth_base64 = base64.b64encode(auth_bytes).decode('ascii')

        headers = {
            'Authorization': f'Basic {auth_base64}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        params = {
            'grant_type': 'authorization_code',
            'redirect_uri': 'https://api.enphaseenergy.com/oauth/redirect_uri',
            'code': code
        }

        response = requests.post(token_url, params=params, headers=headers)
        token_data = response.json()

        access_token = token_data.get('access_token')

        if not access_token:
            return {"error": "Failed to obtain access token", "details": token_data}

        return access_token

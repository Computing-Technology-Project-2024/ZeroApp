import requests
import base64
from urllib.parse import urlencode

# Enphase API details
CLIENT_ID = "e3a91a728bfb5bb020bd00dd8202768e"
CLIENT_SECRET = "17915396d4ee5439210dc3c52130cb3d"
AUTH_URL = "https://api.enphaseenergy.com/oauth/authorize"
TOKEN_URL = "https://api.enphaseenergy.com/oauth/token"
REDIRECT_URI = "https://api.enphaseenergy.com/oauth/redirect_uri"
API_KEY = "e2c98c826a5031d395ba7e57b9ac03f8"

def generate_auth_url():
    """
    Generate the authorization URL to send to the system owner to get their approval.
    """
    query_params = {
        'response_type': 'code',
        'client_id': CLIENT_ID,
        'redirect_uri': REDIRECT_URI,
        'scope': 'read',
        'state': 'xyz'
    }
    
    auth_url = f"{AUTH_URL}?{urlencode(query_params)}"
    print(f"Please visit this URL and authorize access: {auth_url}")
    return auth_url

def get_access_token(auth_code):
    """
    Retrieve the OAuth2 access token using the authorization code received.
    :param auth_code: Authorization code received from the authorization URL
    :return: Access token
    """
    auth_string = f"{CLIENT_ID}:{CLIENT_SECRET}"
    encoded_auth_string = base64.b64encode(auth_string.encode()).decode()

    headers = {
        'Authorization': f'Basic {encoded_auth_string}',
    }

    data = {
        'grant_type': 'authorization_code',
        'redirect_uri': REDIRECT_URI,
        'code': auth_code
    }

    response = requests.post(TOKEN_URL, headers=headers, data=data)
    
    if response.status_code == 200:
        token_data = response.json()
        return token_data['access_token'], token_data['refresh_token']
    else:
        raise Exception(f"Error retrieving access token: {response.text}")

def refresh_access_token(refresh_token):
    """
    Refresh the OAuth2 access token using the refresh token.
    :param refresh_token: Refresh token received with the initial access token
    :return: New access token
    """
    auth_string = f"{CLIENT_ID}:{CLIENT_SECRET}"
    encoded_auth_string = base64.b64encode(auth_string.encode()).decode()

    headers = {
        'Authorization': f'Basic {encoded_auth_string}',
    }

    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }

    response = requests.post(TOKEN_URL, headers=headers, data=data)
    
    if response.status_code == 200:
        token_data = response.json()
        return token_data['access_token'], token_data['refresh_token']
    else:
        raise Exception(f"Error refreshing access token: {response.text}")

# Usage:
# Step 1: Generate the authorization URL
generate_auth_url()

# Step 2: Front end get an authorization code
# auth_code = "Received_from_redirect"
# access_token, refresh_token = get_access_token(auth_code)

# Step 3: Use refresh token to get a new access token when the old one expires
# new_access_token, new_refresh_token = refresh_access_token(refresh_token)

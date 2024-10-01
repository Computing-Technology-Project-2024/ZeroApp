import base64
from fastapi import APIRouter
import requests
import time

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from urllib.parse import urlparse, parse_qs


enphrase_router = APIRouter(
    prefix="/enphrase",
    tags=["enphrase"]
)

# GET http://127.0.0.1:8000/enphrase/get-code (POSTMAN)
@enphrase_router.get("/get-code")
def get_code():
    # Set up Selenium WebDriver
    chrome_options = Options()
    chrome_options.add_argument('--headless')  # Run in headless mode
    driver = webdriver.Chrome(options=chrome_options)

    try:
        # Step 1: Get the authorization code
        auth_url = 'https://api.enphaseenergy.com/oauth/authorize?response_type=code&client_id=e3a91a728bfb5bb020bd00dd8202768e&redirect_uri=https://api.enphaseenergy.com/oauth/redirect_uri'
        driver.get(auth_url)

        # Wait for the page to load
        time.sleep(2)

        # Log in
        username_input = driver.find_element(By.NAME, 'email')
        password_input = driver.find_element(By.NAME, 'password')

        username_input.send_keys('mmalam@swin.edu.au')
        password_input.send_keys('1Swinburne')

        # Submit the login form
        login_button = driver.find_element(By.XPATH, '//input[@type="submit" and @value="Login"]')
        login_button.click()

        time.sleep(2)  # Wait for the consent page to load

        # Click the "Allow Access" button
        allow_button = driver.find_element(By.ID, 'allow_button')
        allow_button.click()

        time.sleep(2)  # Wait for redirection

        # Get the authorization code from the URL or page
        current_url = driver.current_url
        parsed_url = urlparse(current_url)
        query_params = parse_qs(parsed_url.query)
        code = query_params.get('code', [None])[0]

        if not code:
            # Try to find the code on the page
            code_span = driver.find_element(By.XPATH, '//div[@id="enphaseapi_module"]//span')
            code = code_span.text.strip()

        if not code:
            return {"error": "Authorization code not found"}

        # Step 2: Exchange the authorization code for an access token
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

        # Step 3: Use the access token and API key to get the data
        api_key = 'e2c98c826a5031d395ba7e57b9ac03f8'

        api_url = f'https://api.enphaseenergy.com/api/v4/systems?key={api_key}'

        api_headers = {
            'Authorization': f'Bearer {access_token}'
        }

        api_response = requests.get(api_url, headers=api_headers)
        api_data = api_response.json()

        return api_data

    except Exception as e:
        return {"error": str(e)}
    finally:
        driver.quit()

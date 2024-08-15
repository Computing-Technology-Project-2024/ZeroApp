# global configuration, env variables
import os
from dotenv import load_dotenv

load_dotenv()  # Load the .env file

# Get the environment variables
MONGO_DETAILS = os.getenv("MONGO_DETAILS")
DATABASE_NAME = os.getenv("DATABASE_NAME")
API_KEY = os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")

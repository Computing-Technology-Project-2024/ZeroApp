# global configuration, env variables
import os
from dotenv import load_dotenv

load_dotenv()  # Load the .env file

# Get the environment variables
DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")
ECX_API_KEY = os.getenv("ECX_API_KEY")
ECX_BASE_URL = os.getenv("ECX_BASE_URL")

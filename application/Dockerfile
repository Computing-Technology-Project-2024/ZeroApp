# Use the official Python 3.9 image as the base image
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY ./requirements.txt /app/requirements.txt

# Install the Python dependencies inside the container
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Copy the FastAPI app code into the container
COPY ./public_api /app/public_api

# Expose port 8000 to the outside world
EXPOSE 8000

# Command to run the FastAPI application using Uvicorn
CMD ["uvicorn", "public_api.main:app", "--host", "0.0.0.0", "--port", "8000"]

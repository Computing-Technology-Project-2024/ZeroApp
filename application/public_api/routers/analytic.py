from fastapi import APIRouter

analytic_router = APIRouter(
    prefix="/analytics",
    tags=["analytic"]
)

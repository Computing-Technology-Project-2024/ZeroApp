import os
from datetime import timedelta
from typing import Annotated, Optional, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

from ..database import get_db
from ..schemas.account import Account, CreateAccountIntermediateHandling
from ..schemas.auth import SignUp
from ..services.account_service import get_account_using_email, get_account_using_id, get_all_admins, remove_account, update_account, add_new_account_service
from ..utils.security import hash_password

account_router = APIRouter(
    prefix="/account",
    tags=["account"]
)


"""
find by an account email or id:
usage example: GET http://localhost:8000/account?email=conghieppham2005@gmail.com (POSTMAN)
or: GET http://localhost:8000/account?id=66fa725a587c59992efe7934 (POSTMAN)
"""
@account_router.get("")
async def get_account(
    id: Optional[str] = None,
    email: Optional[str] = None,
    db: AsyncIOMotorClient = Depends(get_db)
):
    # Handle request by ID
    if id:
        account = await get_account_using_id(id, db)
        if account:
            return account
        raise HTTPException(status_code=404, detail="Account not found with this ID")

    # Handle request by Email
    if email:
        account = await get_account_using_email(email, db)
        if account:
            return account
        raise HTTPException(status_code=404, detail="Account not found with this email")

    # If neither parameter is provided
    raise HTTPException(status_code=400, detail="You must provide either 'id' or 'email'")



# usage example: GET http://localhost:8000/account/admin-list (POSTMAN)
@account_router.get("/admin-list")
async def get_admin_list(db: AsyncIOMotorClient = Depends(get_db)):
    account = await get_all_admins(db)
    if account:
        return account
    else:
        raise HTTPException(status_code=404, detail="No accounts found")



"""
usage example: POST http://localhost:8000/account
json body: 
{
    "username": "NewUser123",
    "email": "newuser@example.com",
    "password": "mypassword123",
    "mobile_number": "123456789"
}
(POSTMAN)
"""
@account_router.post("")
async def add_account_api(
    account_data: CreateAccountIntermediateHandling,
    db: AsyncIOMotorClient = Depends(get_db)
):
    try:
        account_dict = account_data.model_dump()
        # Set the deleted field to false by default when creating an account
        account_dict["deleted"] = False  
        account_id = await add_new_account_service(account_dict, db)
        return {"message": "Account created successfully", "account_id": account_id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



"""
usage example: PATCH http://localhost:8000/account/{account_id}
json body: 
{
    "username": "NewUsername",
    "email": "newemail@example.com"
}
(POSTMAN)
"""
@account_router.patch("/{account_id}")
async def update_account_api(
    account_id: str,
    update_data: Dict[str, str],  # Dictionary of fields to update
    db: AsyncIOMotorClient = Depends(get_db)
):
    try:
        success = await update_account(account_id, update_data, db)
        if success:
            return {"message": "Account updated successfully"}
        else:
            raise HTTPException(status_code=404, detail="Account not found")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))




# usage example: DELETE http://localhost:8000/account?account_id=66fa725a587c59992efe7934 (POSTMAN)
@account_router.delete("")
async def delete_by_id(account_id: str, db: AsyncIOMotorClient = Depends(get_db)):
    try:
        # Validate if account_id is a valid ObjectId
        if not ObjectId.is_valid(account_id):
            raise HTTPException(status_code=400, detail="Invalid account ID")

        account = await remove_account(account_id, db)
        if account:
            return {"message": "Account soft-deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="Account not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

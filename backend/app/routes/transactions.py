# backend/app/routes/transactions.py
from fastapi import APIRouter, Depends
from app.models.database import transactions
from app.models.schema import TransactionsResponse
from app.core.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=TransactionsResponse)
def get_all_transactions(user_data: dict = Depends(get_current_user)):
    """
    Fetch all transactions belonging to the currently authenticated user.
    """
    # Extract the user's ID from the decoded Firebase token
    uid = user_data.get("uid")

    # Only find transactions where user_id matches the logged-in user
    data = list(transactions.find({"user_id": uid}, {"_id": 0}))
    
    return {"items": data}
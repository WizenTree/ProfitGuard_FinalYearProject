# backend/app/routes/transactions.py
from fastapi import APIRouter, Depends
from app.models.database import transactions
from app.models.schema import TransactionsResponse
from app.core.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=TransactionsResponse)
def get_all_transactions(skip: int = 0, limit: int = 500, user_data: dict = Depends(get_current_user)):
    """Fetch transactions belonging to the currently authenticated user (paginated)."""
    uid = user_data.get("uid")
    # Added .skip() and .limit() to prevent crashing the browser on massive datasets
    data = list(transactions.find({"user_id": uid}, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit))
    return {"items": data}
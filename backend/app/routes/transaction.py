# backend/app/routes/transaction.py
from fastapi import APIRouter, Depends, HTTPException
from app.models.database import transactions
from app.models.schema import TransactionRequest
from app.core.auth import get_current_user
from datetime import datetime

router = APIRouter()

@router.post("/")
def create_transaction(
    transaction_data: TransactionRequest, 
    user_data: dict = Depends(get_current_user) # 1. Require auth token
):
    """
    Creates a new transaction and ties it to the logged-in user.
    """
    # 2. Extract the user's ID
    uid = user_data.get("uid")

    # 3. Calculate profit and totals
    total_revenue = transaction_data.selling_price * transaction_data.quantity
    total_cost = (transaction_data.cost_price + transaction_data.shipping + transaction_data.fees) * transaction_data.quantity
    profit = total_revenue - total_cost

    # 4. Prepare the document to insert into MongoDB
    new_tx = {
        "user_id": uid, # THIS IS THE MAGIC LINE! It ties the data to YOU.
        "product": transaction_data.product,
        "type": transaction_data.type,
        "quantity": transaction_data.quantity,
        "selling_price": transaction_data.selling_price,
        "cost_price": transaction_data.cost_price,
        "shipping": transaction_data.shipping,
        "fees": transaction_data.fees,
        "total_revenue": total_revenue,
        "total_cost": total_cost,
        "profit": profit,
        "created_at": datetime.utcnow()
    }

    # Insert into database
    result = transactions.insert_one(new_tx)

    if result.inserted_id:
        return {"message": "Transaction added successfully", "id": str(result.inserted_id)}
    
    raise HTTPException(status_code=500, detail="Failed to add transaction")
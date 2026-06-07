# backend/app/routes/transaction.py
from fastapi import APIRouter, Depends, HTTPException
from app.models.database import transactions, products
from app.models.schema import TransactionRequest
from app.core.auth import get_current_user
from app.utils.helpers import normalize_product_name, format_display_name
from datetime import datetime

router = APIRouter()

@router.post("/")
def create_transaction(
    transaction_data: TransactionRequest, 
    user_data: dict = Depends(get_current_user)
):
    uid = user_data.get("uid")

    # Safety Check 1: Prevent negative or zero quantity
    if transaction_data.quantity <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than zero.")

    total_revenue = transaction_data.selling_price * transaction_data.quantity
    total_cost = (transaction_data.cost_price * transaction_data.quantity) + transaction_data.shipping + transaction_data.fees
    profit = total_revenue - total_cost if transaction_data.type == "sale" else 0

    normalized_name = normalize_product_name(transaction_data.product)
    display_name = format_display_name(transaction_data.product)
    created_at = datetime.utcnow()

    # --- INVENTORY SYNC LOGIC ---
    product = products.find_one({"name": normalized_name, "user_id": uid})

    if transaction_data.type == "purchase":
        if product:
            new_stock = product["stock"] + transaction_data.quantity
            total_existing_cost = product["avg_cost"] * product["stock"]
            total_new_cost = total_cost
            avg_cost = (total_existing_cost + total_new_cost) / new_stock if new_stock > 0 else 0

            products.update_one(
                {"name": normalized_name, "user_id": uid},
                {"$set": {"stock": new_stock, "avg_cost": avg_cost, "updated_at": created_at}}
            )
        else:
            products.insert_one({
                "user_id": uid, 
                "name": normalized_name,
                "display_name": display_name,
                "stock": transaction_data.quantity,
                "avg_cost": transaction_data.cost_price, # Initial average cost is the unit cost price
                "created_at": created_at,
                "updated_at": created_at
            })

    elif transaction_data.type == "sale":
        current_stock = product.get("stock", 0) if product else 0
        
        # Safety Check 2: Prevent negative stock
        if current_stock < transaction_data.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient stock for '{display_name}'. Available: {current_stock}, Requested to sell: {transaction_data.quantity}"
            )

        new_stock = current_stock - transaction_data.quantity
        products.update_one(
            {"name": normalized_name, "user_id": uid},
            {"$set": {"stock": new_stock, "updated_at": created_at}}
        )

    # --- SAVE TRANSACTION ---
    new_tx = {
        "user_id": uid,
        "product": normalized_name,
        "display_name": display_name,
        "type": transaction_data.type,
        "quantity": transaction_data.quantity,
        "selling_price": transaction_data.selling_price,
        "cost_price": transaction_data.cost_price,
        "shipping": transaction_data.shipping,
        "fees": transaction_data.fees,
        "total_revenue": total_revenue,
        "total_cost": total_cost,
        "profit": profit,
        "created_at": created_at
    }

    result = transactions.insert_one(new_tx)

    if result.inserted_id:
        return {"message": "Transaction added successfully", "id": str(result.inserted_id)}
    
    raise HTTPException(status_code=500, detail="Failed to add transaction")

# Add this at the bottom of backend/app/routes/transaction.py

@router.delete("/all")
def delete_all_user_data(user_data: dict = Depends(get_current_user)):
    """Permanently delete all transactions and inventory for the authenticated user."""
    uid = user_data.get("uid")
    
    # Securely delete only the data belonging to this uid
    tx_result = transactions.delete_many({"user_id": uid})
    prod_result = products.delete_many({"user_id": uid})
    
    return {
        "message": "All user data successfully deleted",
        "transactions_deleted": tx_result.deleted_count,
        "products_deleted": prod_result.deleted_count
    }
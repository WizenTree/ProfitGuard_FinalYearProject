from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from app.models.database import products, transactions
from app.models.schema import TransactionRequest, TransactionResponse
from app.utils.helpers import normalize_product_name, format_display_name

router = APIRouter()

@router.post("/", response_model=TransactionResponse)
async def create_transaction(data: TransactionRequest):

    normalized_name = normalize_product_name(data.product)
    display_name = format_display_name(data.product)

    product = products.find_one({"name": normalized_name})

    now = datetime.now(timezone.utc)

    # CALCULATIONS
    quantity = data.quantity

    # FIX: Shipping and fees are usually totals per transaction, not per item.
    total_revenue = data.selling_price * quantity
    total_cost = (data.cost_price * quantity) + data.shipping + data.fees
    profit = total_revenue - total_cost if data.type == "sale" else 0

    # ... inside PURCHASE LOGIC ...
    if data.type == "purchase":
        if product:
            new_stock = product["stock"] + quantity
            
            total_existing_cost = product["avg_cost"] * product["stock"]
            # FIX: Factor shipping and fees into the new average cost of the items
            total_new_cost = (data.cost_price * quantity) + data.shipping + data.fees

            avg_cost = (total_existing_cost + total_new_cost) / new_stock
    # total_revenue = data.selling_price * quantity
    # total_cost = (data.cost_price + data.shipping + data.fees) * quantity
    # profit = total_revenue - total_cost if data.type == "sale" else 0

    # # PURCHASE LOGIC
    # if data.type == "purchase":

    #     if product:
    #         new_stock = product["stock"] + quantity

    #         # weighted avg cost (ONLY cost_price matters here)
    #         total_existing_cost = product["avg_cost"] * product["stock"]
    #         total_new_cost = data.cost_price * quantity

    #         avg_cost = (total_existing_cost + total_new_cost) / new_stock

            products.update_one(
                {"name": normalized_name},
                {
                    "$set": {
                        "stock": new_stock,
                        "avg_cost": avg_cost,
                        "updated_at": now
                    }
                }
            )
        else:
            products.insert_one({
                "name": normalized_name,
                "display_name": display_name,
                "stock": quantity,
                "avg_cost": data.cost_price,
                "created_at": now,
                "updated_at": now
            })

    # SALE LOGIC
    elif data.type == "sale":

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        if product["stock"] < quantity:
            raise HTTPException(status_code=400, detail="Not enough stock")

        new_stock = product["stock"] - quantity

        products.update_one(
            {"name": normalized_name},
            {
                "$set": {
                    "stock": new_stock,
                    "updated_at": now
                }
            }
        )

    else:
        raise HTTPException(status_code=400, detail="Invalid transaction type")

    # SAVE TRANSACTION (COMMON STRUCTURE)
    transaction = {
        "product": normalized_name,
        "display_name": display_name,
        "type": data.type,
        "quantity": quantity,

        "selling_price": data.selling_price,
        "cost_price": data.cost_price,
        "shipping": data.shipping,
        "fees": data.fees,

        "total_revenue": total_revenue,
        "total_cost": total_cost,
        "profit": profit,

        "created_at": now
    }

    transactions.insert_one(transaction)
    
    # FIX: Remove the ObjectId before returning the dictionary
    transaction.pop("_id", None) 

    return transaction
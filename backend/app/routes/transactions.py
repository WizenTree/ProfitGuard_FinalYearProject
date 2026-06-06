from fastapi import APIRouter
from app.models.database import transactions
from app.models.schema import TransactionsResponse, TransactionItem

router = APIRouter()

@router.get("/", response_model=TransactionsResponse)
async def get_transactions(type: str = None):

    items = []
    query = {}

    if type:
        query["type"] = type

    for txn in transactions.find(query).sort("created_at", -1):

        # 1. Calculate values with safe defaults
        selling_price = txn.get("selling_price", txn.get("price", 0)) or 0
        cost_price = txn.get("cost_price", 0) or 0
        quantity = txn.get("quantity", 0) or 0
        
        # Calculate revenue/cost if not present in DB, handling potential None values
        total_revenue = txn.get("total_revenue", selling_price * quantity)
        total_cost = txn.get("total_cost", cost_price * quantity)
        
        # 2. Sanitize profit specifically to avoid the ValidationError
        profit_val = txn.get("profit")
        if profit_val is None:
            profit_val = 0.0

        # 3. Append only once
        items.append(
            TransactionItem(
                product=txn.get("product", ""),
                display_name=txn.get("display_name", txn.get("product", "")),
                type=txn.get("type", ""),
                quantity=quantity,

                selling_price=float(selling_price),
                cost_price=float(cost_price),
                shipping=txn.get("shipping", 0) or 0.0,
                fees=txn.get("fees", 0) or 0.0,

                total_revenue=float(total_revenue),
                total_cost=float(total_cost),
                profit=float(profit_val), # Use the sanitized value

                created_at=txn.get("created_at")
            )
        )

    return {"items": items}
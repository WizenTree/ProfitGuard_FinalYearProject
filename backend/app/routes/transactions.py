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

        # ✅ fallback for old DB data
        selling_price = txn.get("selling_price", txn.get("price", 0))
        cost_price = txn.get("cost_price", 0)

        total_revenue = txn.get("total_revenue", selling_price * txn.get("quantity", 0))
        total_cost = txn.get("total_cost", cost_price * txn.get("quantity", 0))

        items.append(
            TransactionItem(
                product=txn.get("product", ""),
                display_name=txn.get("display_name", txn.get("product", "")),
                type=txn.get("type", ""),
                quantity=txn.get("quantity", 0),

                selling_price=selling_price,
                cost_price=cost_price,
                shipping=txn.get("shipping", 0),
                fees=txn.get("fees", 0),

                total_revenue=total_revenue,
                total_cost=total_cost,
                profit=txn.get("profit", 0),

                created_at=txn.get("created_at")
            )
        )

    return {"items": items}
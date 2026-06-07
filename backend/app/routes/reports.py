# backend/app/routes/reports.py
from fastapi import APIRouter, Depends
from app.models.database import transactions
from app.models.schema import ReportsResponse, TopProduct
from app.core.auth import get_current_user # 1. Import auth dependency

router = APIRouter()

@router.get("/", response_model=ReportsResponse)
async def get_reports(user_data: dict = Depends(get_current_user)): # 2. Require token
    # 3. Extract the user's ID
    uid = user_data.get("uid")

    total_profit = 0
    total_revenue = 0
    total_cost = 0  

    product_sales = {}

    # 4. ONLY search for transactions that match this user's ID
    for txn in transactions.find({"user_id": uid}):

        txn_type = txn.get("type")

        revenue = txn.get("total_revenue", 0)
        cost = txn.get("total_cost", 0)
        profit = txn.get("profit", 0)

        # SALES
        if txn_type == "sale":
            total_revenue += revenue
            total_profit += profit

            # track product sales
            name = txn.get("display_name", "Unknown")
            quantity = txn.get("quantity", 0)

            product_sales[name] = product_sales.get(name, 0) + quantity

        # PURCHASES (inventory investment)
        elif txn_type == "purchase":
            total_cost += cost

    # Top products
    sorted_products = sorted(
        product_sales.items(),
        key=lambda x: x[1],
        reverse=True
    )

    top_products = [
        TopProduct(product=name, total_quantity=qty)
        for name, qty in sorted_products[:5]
    ]

    return {
        "total_profit": round(total_profit, 2),
        "total_revenue": round(total_revenue, 2),
        "total_cost": round(total_cost, 2),
        "top_products": top_products
    }
from fastapi import APIRouter
from app.models.database import transactions
from app.models.schema import ReportsResponse, TopProduct

router = APIRouter()

@router.get("/", response_model=ReportsResponse)
async def get_reports():

    total_profit = 0
    total_revenue = 0
    total_cost = 0  # ONLY purchases

    product_sales = {}

    for txn in transactions.find():

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
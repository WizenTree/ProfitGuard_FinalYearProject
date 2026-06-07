# backend/app/routes/reports.py
from fastapi import APIRouter, Depends
from app.models.database import transactions
from app.models.schema import ReportsResponse, TopProduct, GrowthData
from app.core.auth import get_current_user
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=ReportsResponse)
async def get_reports(period: str = "month", user_data: dict = Depends(get_current_user)):
    uid = user_data.get("uid")

    total_profit = 0
    total_revenue = 0
    total_cost = 0  

    product_sales = {}
    growth_dict = {}

    for txn in transactions.find({"user_id": uid}):
        txn_type = txn.get("type")
        revenue = txn.get("total_revenue", 0)
        cost = txn.get("total_cost", 0)
        profit = txn.get("profit", 0)
        
        # Handle time-series grouping
        date_val = txn.get("created_at")
        if date_val:
            if isinstance(date_val, str):
                try: date_val = datetime.fromisoformat(date_val.replace("Z", "+00:00"))
                except: pass

            if isinstance(date_val, datetime):
                if period == "day":
                    key = date_val.strftime("%Y-%m-%d")
                elif period == "week":
                    key = date_val.strftime("%Y-W%W") # e.g., 2026-W23
                elif period == "year":
                    key = date_val.strftime("%Y")
                else: # default to month
                    key = date_val.strftime("%Y-%m")
                
                if key not in growth_dict:
                    growth_dict[key] = {"revenue": 0, "cost": 0, "profit": 0}
                
                if txn_type == "sale":
                    growth_dict[key]["revenue"] += revenue
                    growth_dict[key]["profit"] += profit
                elif txn_type == "purchase":
                    growth_dict[key]["cost"] += cost

        # SALES TOTALS
        if txn_type == "sale":
            total_revenue += revenue
            total_profit += profit
            name = txn.get("display_name", "Unknown")
            quantity = txn.get("quantity", 0)
            product_sales[name] = product_sales.get(name, 0) + quantity

        # PURCHASES TOTALS
        elif txn_type == "purchase":
            total_cost += cost

    # Sort Top products
    sorted_products = sorted(product_sales.items(), key=lambda x: x[1], reverse=True)
    top_products = [TopProduct(product=name, total_quantity=qty) for name, qty in sorted_products[:5]]

    # Sort timeline chronologically (YYYY-MM-DD strings sort naturally)
    sorted_growth_keys = sorted(growth_dict.keys())
    growth_data = [
        GrowthData(
            date=k, 
            revenue=round(growth_dict[k]["revenue"], 2), 
            cost=round(growth_dict[k]["cost"], 2), 
            profit=round(growth_dict[k]["profit"], 2)
        )
        for k in sorted_growth_keys
    ]

    return {
        "total_profit": round(total_profit, 2),
        "total_revenue": round(total_revenue, 2),
        "total_cost": round(total_cost, 2),
        "top_products": top_products,
        "growth_data": growth_data
    }
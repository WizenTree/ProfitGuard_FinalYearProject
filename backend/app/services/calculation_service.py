def calculate_profit(data):
    cost = data.get("cost") or data.get("cost_price")
    price = data.get("selling_price")
    quantity = data.get("quantity", 1)
    shipping = data.get("shipping", 0)
    fees = data.get("fees", 0)

    # 🔒 Validate required fields
    if cost is None or price is None:
        return {
            "profit": None,
            "margin": None,
            "error": "Missing cost or selling price"
        }

    try:
        cost = float(cost)
        price = float(price)
        quantity = int(quantity)
        shipping = float(shipping)
        fees = float(fees)
    except:
        return {
            "profit": None,
            "margin": None,
            "error": "Invalid numeric values"
        }

    # 🧮 Calculations
    total_revenue = price * quantity
    total_cost = (cost + shipping + fees) * quantity
    profit = total_revenue - total_cost

    margin = (profit / total_cost) * 100 if total_cost != 0 else 0

    return {
        "profit": round(profit, 2),
        "margin": round(margin, 2),
        "total_revenue": round(total_revenue, 2),
        "total_cost": round(total_cost, 2)
    }
# def calculate_profit(data):
#     cost = data["cost"]
#     price = data["selling_price"]

#     profit = price - cost
#     margin = (profit / cost) * 100

#     return {
#         "profit": profit,
#         "margin": margin
#     }

def calculate_profit(data):
    cost = data.get("cost")
    price = data.get("selling_price")

    if cost is None or price is None:
        return {"error": "Missing cost or selling price"}

    profit = price - cost
    margin = (profit / cost) * 100 if cost != 0 else 0

    return {
        "profit": profit,
        "margin": round(margin, 2)
    }
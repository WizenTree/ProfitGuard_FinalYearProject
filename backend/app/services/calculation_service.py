def calculate_profit(data):
    cost = data["cost"]
    price = data["selling_price"]

    profit = price - cost
    margin = (profit / cost) * 100

    return {
        "profit": profit,
        "margin": margin
    }
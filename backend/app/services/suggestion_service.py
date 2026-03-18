def generate_suggestions(profit_data):
    if profit_data["margin"] < 20:
        return ["Increase price", "Reduce cost"]
    return ["Good profit margin"]
# def generate_suggestions(profit_data):
#     if profit_data["margin"] < 20:
#         return ["Increase price", "Reduce cost"]
#     return ["Good profit margin"]

def generate_suggestions(profit_data):
    profit = profit_data.get("profit")
    margin = profit_data.get("margin")

    suggestions = []

    if profit is None or margin is None:
        return ["Insufficient data"]

    if profit < 0:
        suggestions.append("You're making a loss. Reduce cost or increase price.")
    
    elif margin < 20:
        suggestions.append("Low profit margin. Try increasing price or reducing costs.")
    
    elif 20 <= margin < 50:
        suggestions.append("Decent margin. Consider optimizing marketing to increase sales.")
    
    else:
        suggestions.append("Great profit margin. Consider scaling this product.")

    return suggestions
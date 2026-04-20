import re

def parse_text(text):
    data = {}

    # Extract product
    product_match = re.search(r"Product:\s*(.*)", text)
    if product_match:
        data["product"] = product_match.group(1).strip()

    # Extract cost
    cost_match = re.search(r"Cost:\s*(\d+)", text)
    if cost_match:
        data["cost"] = int(cost_match.group(1))

    # Extract selling price
    price_match = re.search(r"Selling Price:\s*(\d+)", text)
    if price_match:
        data["selling_price"] = int(price_match.group(1))

    return data
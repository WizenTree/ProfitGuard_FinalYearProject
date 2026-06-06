def normalize_product_name(name:str) -> str:
    return " ".join(name.strip().lower().split())

def format_display_name(name:str) -> str:
    return name.strip().title()
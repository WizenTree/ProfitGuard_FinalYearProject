# backend/app/routes/bulk_upload.py
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import csv
from io import StringIO
from datetime import datetime, timezone

from app.models.database import products, transactions
from app.utils.helpers import normalize_product_name, format_display_name
from app.core.auth import get_current_user

router = APIRouter()

def safe_float(value):
    try: return float(value)
    except: return 0.0

def safe_int(value):
    try: return int(float(value)) 
    except: return 0

def validate_price(value):
    if isinstance(value, str) and "-" in value and "19" in value:
        raise Exception("Invalid price format")
    return float(value)

def parse_date(date_str):
    try: return datetime.strptime(date_str, "%d-%m-%Y").replace(tzinfo=timezone.utc)
    except: return datetime.now(timezone.utc)

@router.post("/")
async def bulk_upload(
    file: UploadFile = File(...),
    user_data: dict = Depends(get_current_user)
):
    uid = user_data.get("uid")

    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")
    
    content = await file.read()
    decoded = content.decode("utf-8-sig") 
    reader = csv.DictReader(StringIO(decoded), delimiter=",")

    if reader.fieldnames is None or len(reader.fieldnames) <= 1:
        reader = csv.DictReader(StringIO(decoded), delimiter="\t")

    results = []
    success_count = 0
    fail_count = 0

    for row in reader:
        # Safely grab the product name FIRST to prevent crashes in the except block
        p_name = row.get("product", "").strip()
        
        if not p_name:
            continue

        try:
            type_ = row.get("type", "").strip().lower()
            quantity = safe_int(row.get("quantity"))
            selling_price = safe_float(row.get("selling_price"))
            cost_price = validate_price(row.get("cost_price", "0"))
            shipping = safe_float(row.get("shipping"))
            fees = safe_float(row.get("fees"))
            created_at = parse_date(row.get("date", ""))

            normalized_name = normalize_product_name(p_name)
            display_name = format_display_name(p_name)

            product = products.find_one({"name": normalized_name, "user_id": uid})

            total_revenue = selling_price * quantity
            total_cost = (cost_price * quantity) + shipping + fees
            profit = total_revenue - total_cost if type_ == "sale" else 0

            # =========================
            # 🛒 PURCHASE LOGIC
            # =========================
            if type_ == "purchase":
                if product:
                    new_stock = product["stock"] + quantity
                    total_existing_cost = product["avg_cost"] * product["stock"]
                    total_new_cost = (cost_price * quantity) + shipping + fees
                    avg_cost = (total_existing_cost + total_new_cost) / new_stock if new_stock > 0 else 0

                    products.update_one(
                        {"name": normalized_name, "user_id": uid},
                        {"$set": {"stock": new_stock, "avg_cost": avg_cost, "updated_at": created_at}}
                    )
                else:
                    products.insert_one({
                        "user_id": uid, 
                        "name": normalized_name,
                        "display_name": display_name,
                        "stock": quantity,
                        "avg_cost": cost_price,
                        "created_at": created_at,
                        "updated_at": created_at
                    })

            # =========================
            # 🔴 SALE LOGIC
            # =========================
            elif type_ == "sale":
                if not product:
                    # Auto-create the product to prevent the row from failing silently
                    products.insert_one({
                        "user_id": uid,
                        "name": normalized_name,
                        "display_name": display_name,
                        "stock": -quantity, 
                        "avg_cost": cost_price,
                        "created_at": created_at,
                        "updated_at": created_at
                    })
                else:
                    new_stock = product["stock"] - quantity
                    products.update_one(
                        {"name": normalized_name, "user_id": uid},
                        {"$set": {"stock": new_stock, "updated_at": created_at}}
                    )
            else:
                raise Exception("Invalid transaction type")

            # =========================
            # 💾 SAVE TRANSACTION
            # =========================
            transactions.insert_one({
                "user_id": uid,
                "product": normalized_name,
                "display_name": display_name,
                "type": type_,
                "quantity": quantity,
                "selling_price": selling_price,
                "cost_price": cost_price,
                "shipping": shipping,
                "fees": fees,
                "total_revenue": total_revenue,
                "total_cost": total_cost,
                "profit": profit,
                "created_at": created_at
            })

            success_count += 1
            results.append({"product": p_name, "status": "success"})

        except Exception as e:
            fail_count += 1
            print(f"FAILED ROW: {p_name} - Error: {str(e)}") 
            results.append({"product": p_name, "status": "failed", "error": str(e)})

    return {
        "message": f"Bulk upload completed. Success: {success_count}, Failed: {fail_count}",
        "results": results
    }
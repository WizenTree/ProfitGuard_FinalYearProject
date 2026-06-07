# backend/app/routes/bulk_upload.py
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
import csv
import codecs
import io
import pandas as pd
from datetime import datetime, timezone

from app.models.database import products, transactions
from app.utils.helpers import normalize_product_name, format_display_name
from app.core.auth import get_current_user

router = APIRouter()

def safe_float(value):
    if pd.isna(value) or value == "": return 0.0
    try: return float(value)
    except: return 0.0

def safe_int(value):
    if pd.isna(value) or value == "": return 0
    try: return int(float(value)) 
    except: return 0

def validate_price(value):
    if pd.isna(value) or value == "": return 0.0
    if isinstance(value, str) and "-" in value and "19" in value:
        raise Exception("Invalid price format")
    return float(value)

def parse_date(date_str):
    if pd.isna(date_str) or date_str == "": 
        return datetime.utcnow().replace(tzinfo=timezone.utc)
    if isinstance(date_str, datetime):
        return date_str.replace(tzinfo=timezone.utc)
    try: return datetime.strptime(str(date_str).strip(), "%d-%m-%Y").replace(tzinfo=timezone.utc)
    except: return datetime.utcnow().replace(tzinfo=timezone.utc)

@router.post("/")
async def bulk_upload(
    file: UploadFile = File(...),
    user_data: dict = Depends(get_current_user)
):
    uid = user_data.get("uid")

    allowed_types = [
        "text/csv", 
        "application/vnd.ms-excel", 
        "text/plain",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ]
    
    is_csv = file.filename.endswith(".csv")
    is_xlsx = file.filename.endswith(".xlsx")
    
    if file.content_type not in allowed_types and not (is_csv or is_xlsx):
        raise HTTPException(status_code=400, detail="Invalid file type. Only CSV and XLSX files are allowed.")
    
    results = []
    success_count = 0
    fail_count = 0

    try:
        if is_xlsx:
            contents = await file.read()
            df = pd.read_excel(io.BytesIO(contents), engine='openpyxl')
            df = df.fillna("")
            reader = df.to_dict(orient="records")
        else:
            csv_generator = codecs.iterdecode(file.file, 'utf-8-sig')
            reader_csv = csv.DictReader(csv_generator, delimiter=",")
            if reader_csv.fieldnames is None or len(reader_csv.fieldnames) <= 1:
                file.file.seek(0)
                csv_generator = codecs.iterdecode(file.file, 'utf-8-sig')
                reader_csv = csv.DictReader(csv_generator, delimiter="\t")
            reader = list(reader_csv)

        for row in reader:
            p_name = str(row.get("product", "")).strip()
            if not p_name: continue

            try:
                type_ = str(row.get("type", "")).strip().lower()
                quantity = safe_int(row.get("quantity"))
                
                # Safety Check 1: Prevent 0 or negative quantities in bulk
                if quantity <= 0:
                    raise Exception("Quantity must be greater than zero.")

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

                if type_ == "purchase":
                    if product:
                        new_stock = product["stock"] + quantity
                        total_existing_cost = product["avg_cost"] * product["stock"]
                        avg_cost = (total_existing_cost + total_cost) / new_stock if new_stock > 0 else 0
                        products.update_one(
                            {"name": normalized_name, "user_id": uid},
                            {"$set": {"stock": new_stock, "avg_cost": avg_cost, "updated_at": created_at}}
                        )
                    else:
                        products.insert_one({"user_id": uid, "name": normalized_name, "display_name": display_name, "stock": quantity, "avg_cost": cost_price, "created_at": created_at, "updated_at": created_at})

                elif type_ == "sale":
                    current_stock = product.get("stock", 0) if product else 0
                    
                    # Safety Check 2: Strict inventory validation
                    if current_stock < quantity:
                        raise Exception(f"Insufficient stock. Available: {current_stock}, Requested to sell: {quantity}")
                    
                    new_stock = current_stock - quantity
                    products.update_one({"name": normalized_name, "user_id": uid}, {"$set": {"stock": new_stock, "updated_at": created_at}})
                else:
                    raise Exception(f"Invalid transaction type: {type_}")

                transactions.insert_one({
                    "user_id": uid, "product": normalized_name, "display_name": display_name, "type": type_,
                    "quantity": quantity, "selling_price": selling_price, "cost_price": cost_price,
                    "shipping": shipping, "fees": fees, "total_revenue": total_revenue, 
                    "total_cost": total_cost, "profit": profit, "created_at": created_at
                })

                success_count += 1
                results.append({"product": p_name, "status": "success"})

            except Exception as e:
                fail_count += 1
                results.append({"product": p_name, "status": "failed", "error": str(e)})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
    finally:
        file.file.close()

    return {
        "message": f"Bulk upload completed. Success: {success_count}, Failed: {fail_count}",
        "results": results
    }
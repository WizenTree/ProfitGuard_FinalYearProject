# backend/app/routes/inventory.py
from fastapi import APIRouter, HTTPException, Depends
from app.models.database import products
from app.models.schema import InventoryResponse, InventoryItem
from app.core.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=InventoryResponse)
async def get_inventory(skip: int = 0, limit: int = 500, user_data: dict = Depends(get_current_user)):
    uid = user_data.get("uid")
    items = []
    
    # Added pagination limits
    for product in products.find({"user_id": uid}).sort("updated_at", -1).skip(skip).limit(limit):
        items.append(
            InventoryItem(
                name=product.get("name"),
                display_name=product.get("display_name", product.get("name")),
                stock=product.get("stock", 0),
                avg_cost=product.get("avg_cost", 0.0),
                updated_at=product.get("updated_at")
            )
        )
    return {"items": items}

@router.delete("/{product_name}")
async def delete_product(product_name: str, user_data: dict = Depends(get_current_user)):
    uid = user_data.get("uid")
    result = products.delete_one({"name": product_name, "user_id": uid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found or unauthorized")
    return {"message": f"Product '{product_name}' successfully deleted"}
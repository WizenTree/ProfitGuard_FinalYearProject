from fastapi import APIRouter, HTTPException
from app.models.database import products
from app.models.schema import InventoryResponse, InventoryItem

router = APIRouter()

@router.get("/", response_model=InventoryResponse)
async def get_inventory():
    items = []
    for product in products.find().sort("updated_at", -1):
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
async def delete_product(product_name: str):
    """
    Deletes a product from the inventory catalog by its normalized name.
    """
    result = products.delete_one({"name": product_name})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found in inventory")
        
    return {"message": f"Product '{product_name}' successfully deleted"}
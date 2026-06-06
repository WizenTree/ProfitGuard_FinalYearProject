from fastapi import APIRouter
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
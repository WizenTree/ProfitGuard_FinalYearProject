# backend/app/routes/inventory.py
from fastapi import APIRouter, Depends, HTTPException
from app.models.database import products  # Import the MongoDB collection directly
from app.services.inventory_service import InventoryService
from app.core.auth import get_current_user

router = APIRouter()

# Dependency Provider for FastAPI
def get_inventory_service():
    # Instantiate the OOP class using your MongoDB products collection
    return InventoryService(products)


@router.get("/")
def get_inventory(
    service: InventoryService = Depends(get_inventory_service), 
    user: dict = Depends(get_current_user)
):
    """
    HTTP Controller for fetching inventory.
    """
    user_id = user.get("uid")
    
    # Delegate business logic to the service
    data = service.get_user_inventory(user_id)
    
    return {"status": "success", "data": data}


@router.delete("/{product_name}")
def delete_product(
    product_name: str,
    service: InventoryService = Depends(get_inventory_service),
    user: dict = Depends(get_current_user)
):
    """
    HTTP Controller for deleting a product.
    """
    user_id = user.get("uid")
    
    # Delegate business logic to the service
    success = service.delete_product_by_name(user_id, product_name)
    
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return {"status": "success", "message": f"'{product_name}' deleted successfully"}
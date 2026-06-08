# backend/app/services/inventory_service.py

class InventoryService:
    def __init__(self, products_collection):
        """
        Dependency Injection: We pass the MongoDB collection into the service.
        This makes the service highly testable and decoupled.
        """
        self.products = products_collection

    def get_user_inventory(self, user_id: str) -> list:
        """
        Retrieves all inventory items belonging to a specific user.
        """
        # We exclude the MongoDB '_id' field because it's not JSON serializable by default
        cursor = self.products.find({"user_id": user_id}, {"_id": 0})
        return list(cursor)

    def delete_product_by_name(self, user_id: str, product_name: str) -> bool:
        """
        Deletes a specific product for a specific user.
        Returns True if deleted, False if not found.
        """
        result = self.products.delete_one({"user_id": user_id, "name": product_name})
        return result.deleted_count > 0
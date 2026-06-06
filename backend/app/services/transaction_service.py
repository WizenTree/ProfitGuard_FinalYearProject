from datetime import datetime, timezone
from fastapi import HTTPException
from app.models.database import products, transactions
from app.utils.helpers import normalize_product_name, format_display_name

class TransactionService:
    """
    Encapsulates all business logic and database operations for transactions.
    Follows the Single Responsibility Principle (SRP).
    """

    @staticmethod
    def _calculate_financials(data, quantity):
        """Private method to abstract mathematical calculations (Encapsulation)."""
        total_revenue = data.selling_price * quantity
        total_cost = (data.cost_price * quantity) + data.shipping + data.fees
        profit = total_revenue - total_cost if data.type == "sale" else 0
        return total_revenue, total_cost, profit

    @classmethod
    def _handle_purchase(cls, data, normalized_name, display_name, quantity, now):
        """Handles inventory updates for incoming stock."""
        product = products.find_one({"name": normalized_name})
        
        if product:
            new_stock = product["stock"] + quantity
            total_existing_cost = product["avg_cost"] * product["stock"]
            total_new_cost = (data.cost_price * quantity) + data.shipping + data.fees
            
            # Prevent ZeroDivisionError
            avg_cost = (total_existing_cost + total_new_cost) / new_stock if new_stock > 0 else 0

            products.update_one(
                {"name": normalized_name},
                {"$set": {"stock": new_stock, "avg_cost": avg_cost, "updated_at": now}}
            )
        else:
            products.insert_one({
                "name": normalized_name,
                "display_name": display_name,
                "stock": quantity,
                "avg_cost": data.cost_price,
                "created_at": now,
                "updated_at": now
            })

    @classmethod
    def _handle_sale(cls, normalized_name, quantity, now):
        """Handles inventory deduction and validation for sales."""
        product = products.find_one({"name": normalized_name})
        
        if not product:
            raise ValueError("Product not found")
        if product["stock"] < quantity:
            raise ValueError("Not enough stock")

        new_stock = product["stock"] - quantity
        products.update_one(
            {"name": normalized_name},
            {"$set": {"stock": new_stock, "updated_at": now}}
        )

    @classmethod
    def process_transaction(cls, data):
        """
        Public API for the controller. Abstracted logic execution.
        """
        normalized_name = normalize_product_name(data.product)
        display_name = format_display_name(data.product)
        now = datetime.now(timezone.utc)
        quantity = data.quantity

        # 1. Math Calculation
        total_revenue, total_cost, profit = cls._calculate_financials(data, quantity)

        # 2. Inventory Management
        if data.type == "purchase":
            cls._handle_purchase(data, normalized_name, display_name, quantity, now)
        elif data.type == "sale":
            # Catch value errors thrown by the private method and convert to HTTP exceptions
            try:
                cls._handle_sale(normalized_name, quantity, now)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))
        else:
            raise HTTPException(status_code=400, detail="Invalid transaction type")

        # 3. Save Ledger Entry
        transaction_record = {
            "product": normalized_name,
            "display_name": display_name,
            "type": data.type,
            "quantity": quantity,
            "selling_price": data.selling_price,
            "cost_price": data.cost_price,
            "shipping": data.shipping,
            "fees": data.fees,
            "total_revenue": total_revenue,
            "total_cost": total_cost,
            "profit": profit,
            "created_at": now
        }

        transactions.insert_one(transaction_record)
        
        # Clean up database ID before returning
        transaction_record.pop("_id", None)
        return transaction_record
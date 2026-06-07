# backend/app/models/database.py
from pymongo import MongoClient
from app.core.config import settings

if not settings.MONGO_URL:
    raise Exception("MONGO_URL not found in .env file")

# Create client
client = MongoClient(settings.MONGO_URL)

# Use dynamic database name
db = client[settings.MONGO_DB_NAME]

# =========================
# COLLECTIONS
# =========================
products = db["products"]
transactions = db["transactions"]
users = db["users"]  # Added a Users collection!

# Optional: indexes for performance
products.create_index("name", unique=True)
transactions.create_index("created_at")
users.create_index("uid", unique=True) # Ensure User IDs are unique
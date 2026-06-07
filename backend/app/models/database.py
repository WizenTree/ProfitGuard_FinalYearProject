# backend/app/models/database.py
from pymongo import MongoClient
from app.core.config import settings

if not settings.MONGO_URL:
    raise Exception("MONGO_URL not found in .env file")

# Create client
client = MongoClient(settings.MONGO_URL)
db = client[settings.MONGO_DB_NAME]

# =========================
# COLLECTIONS
# =========================
products = db["products"]
transactions = db["transactions"]
users = db["users"]

# =========================
# INDEXES & MIGRATIONS
# =========================
# 1. Drop the old global uniqueness rule if it exists
try:
    products.drop_index("name_1")
except:
    pass # It's okay if it doesn't exist anymore

# 2. Create the new Multi-User compound index
# This ensures a user can't have two products with the exact same name, 
# but two DIFFERENT users can both have a "Wireless Mouse".
products.create_index([("user_id", 1), ("name", 1)], unique=True)

transactions.create_index("created_at")
users.create_index("uid", unique=True)
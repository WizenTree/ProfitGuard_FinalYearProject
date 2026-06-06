import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

if not MONGO_URL:
    raise Exception("MONGO_URL not found in .env file")

#Create client
client = MongoClient(MONGO_URL)

#Database
db = client["profit_guard_db"]

# =========================
# COLLECTIONS
# =========================

products = db["products"]
transactions = db["transactions"]
analyses = db["analyses"]  # optional (can remove if OCR removed)

# Optional: indexes for performance
products.create_index("name", unique=True)
transactions.create_index("created_at")
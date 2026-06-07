# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routes import health, transaction, inventory, transactions, reports, bulk_upload

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

# Dynamically loading allowed frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.FRONTEND_URLS, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health")
app.include_router(transaction.router, prefix="/transaction", tags=["Transaction"])
app.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(bulk_upload.router, prefix="/bulk-upload", tags=["Bulk Upload"])

@app.get("/")
def root():
    return {
        "service": settings.APP_NAME,
        "status": "running",
        "version": "1.0.0"
    }
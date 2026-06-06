from fastapi import FastAPI
from app.routes import health, transaction, inventory, transactions, reports, bulk_upload
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Profit Guard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(upload.router, prefix="/upload")
# app.include_router(analyze.router, prefix="/analyze")
app.include_router(health.router, prefix="/health")
app.include_router(transaction.router, prefix="/transaction", tags=["Transaction"])
app.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(bulk_upload.router, prefix="/bulk-upload", tags=["Bulk Upload"])

@app.get("/")
def root():
    return {
        "service": "Profit Guard API",
        "status": "running",
        "version": "1.0.0"
    }
# from fastapi import APIRouter

# router = APIRouter()

# @router.get("/")
# def health_check():
#     return {"status": "OK"}

from fastapi import APIRouter
from datetime import datetime, timezone
from app.models.database import client

router = APIRouter()

@router.get("/")
def health_check():
    try:
        # check DB connection
        client.admin.command("ping")
        db_status = "connected"
    except:
        db_status = "disconnected"

    return {
        "status": "OK",
        "database": db_status,
        "timestamp": datetime.now(timezone.utc)
    }
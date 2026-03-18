from fastapi import APIRouter, UploadFile, File

router = APIRouter()

@router.post("/analyze/")
async def analyze(csv_file: UploadFile = File(...), image: UploadFile = File(...)):
    return {
        "message": "API working",
        "profit": 100,
        "status": "PROFIT 🟢"
    }
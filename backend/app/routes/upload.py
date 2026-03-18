from fastapi import APIRouter, UploadFile, File
from app.utils.file_handler import save_file

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    filepath = save_file(file)
    return {"message": "File uploaded", "path": filepath}
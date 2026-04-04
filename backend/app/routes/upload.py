from fastapi import APIRouter, UploadFile, File
from app.utils.file_handler import save_file
from app.services.ocr_service import extract_text   # 👈 NEW
from app.services.parser_service import parse_text
from app.services.calculation_service import calculate_profit
from app.services.suggestion_service import generate_suggestions  # 👈 NEW
from app.models.database import collection 
from datetime import datetime, timezone
from app.models.schema import AnalysisResponse
from PIL import Image

router = APIRouter()

# @router.post("/", response_model=AnalysisResponse)
# async def upload_file(file: UploadFile = File(...)):
#     filepath = save_file(file)

#     text = extract_text(filepath)
#     parsed_data = parse_text(text)
#     profit_data = calculate_profit(parsed_data)
#     suggestions = generate_suggestions(profit_data)
#     document = {
#         "filename": file.filename,
#         "filepath": filepath,
#         "raw_text": text,
#         "parsed_data": parsed_data,
#         "profit_data": profit_data,
#         "suggestions": suggestions,
#         "created_at": datetime.now(timezone.utc)
#     }

#     collection.insert_one(document)

#     return {
#         "raw_text": text,
#         "parsed_data": parsed_data,
#         "profit_data": profit_data,
#         "suggestions": suggestions
#     }

@router.post("/", response_model=AnalysisResponse)
async def upload_file(file: UploadFile = File(...)):

    # File validation
    if file.content_type not in ["image/png", "image/jpeg", "image/jpg"]:
        return AnalysisResponse(error="Only image files are allowed")
    

    filepath = save_file(file)

    #  OCR
    text = extract_text(filepath)
    if not text:
        return AnalysisResponse(error="No text detected")

    # Parsing
    parsed_data = parse_text(text)
    if not parsed_data:
        return AnalysisResponse(
            raw_text=text,
            error="Could not extract structured data"
        )

    # Calculation
    profit_data = calculate_profit(parsed_data)

    #  Suggestions
    suggestions = generate_suggestions(profit_data)

    # Document (FIXED NAMES)
    document = {
        "file_name": file.filename,
        "file_path": filepath,
        "raw_text": text,
        "parsed_data": parsed_data,
        "profit_data": profit_data,
        "suggestions": suggestions,
        "created_at": datetime.now(timezone.utc)
    }

    collection.insert_one(document)

    #  RETURN MATCHING SCHEMA
    return AnalysisResponse(**document)
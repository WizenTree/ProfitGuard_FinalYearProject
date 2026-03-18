# from fastapi import APIRouter, UploadFile, File

# router = APIRouter()

# @router.post("/analyze/")
# async def analyze(csv_file: UploadFile = File(...), image: UploadFile = File(...)):
#     return {
#         "message": "API working",
#         "profit": 100,
#         "status": "PROFIT 🟢"
#     }

from fastapi import APIRouter, UploadFile, File
from app.utils.file_handler import save_file
from app.services.ocr_service import extract_text
from app.services.parser_service import parse_text
from app.services.calculation_service import calculate_profit
from app.services.suggestion_service import generate_suggestions

router = APIRouter()

@router.post("/")
async def analyze(file: UploadFile = File(...)):
    filepath = save_file(file)

    text = extract_text(filepath)
    parsed_data = parse_text(text)
    profit_data = calculate_profit(parsed_data)
    suggestions = generate_suggestions(profit_data)

    return {
        "parsed_data": parsed_data,
        "profit": profit_data,
        "suggestions": suggestions
    }
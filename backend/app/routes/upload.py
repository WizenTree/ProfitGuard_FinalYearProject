from fastapi import APIRouter, UploadFile, File
from app.utils.file_handler import save_file
from app.services.ocr_service import extract_text   # 👈 NEW
from app.services.parser_service import parse_text
from app.services.calculation_service import calculate_profit
from app.services.suggestion_service import generate_suggestions  # 👈 NEW

router = APIRouter()

@router.post("/")
async def upload_file(file: UploadFile = File(...)):
    filepath = save_file(file)

    text = extract_text(filepath)
    parsed_data = parse_text(text)
    profit_data = calculate_profit(parsed_data)
    suggestions = generate_suggestions(profit_data)

    return {
        "raw_text": text,
        "parsed_data": parsed_data,
        "profit_data": profit_data,
        "suggestions": suggestions
    }
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ParsedData(BaseModel):
    product: Optional[str] = None
    cost: Optional[int] = None
    selling_price: Optional[int] = None


class ProfitData(BaseModel):
    profit: Optional[int] = None
    margin: Optional[float] = None


class AnalysisResponse(BaseModel):
    file_name: Optional[str] = None
    raw_text: Optional[str] = None
    parsed_data: Optional[ParsedData] = None
    profit_data: Optional[ProfitData] = None
    suggestions: Optional[List[str]] = None
    created_at: Optional[datetime] = None
    error: Optional[str] = None
from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime


# =========================
# 🔹 AI / OCR MODELS
# =========================

class ParsedData(BaseModel):
    product: Optional[str] = None
    cost_price: Optional[float] = None
    selling_price: Optional[float] = None


class ProfitData(BaseModel):
    profit: Optional[float] = None
    margin: Optional[float] = None


class AnalysisResponse(BaseModel):
    file_name: Optional[str] = None
    raw_text: Optional[str] = None
    parsed_data: Optional[ParsedData] = None
    profit_data: Optional[ProfitData] = None
    suggestions: Optional[List[str]] = None
    created_at: Optional[datetime] = None
    error: Optional[str] = None


# =========================
# 🔹 TRANSACTION MODELS
# =========================

class TransactionRequest(BaseModel):
    product: str
    type: Literal["purchase", "sale"]
    quantity: int

    selling_price: float = 0
    cost_price: float = 0

    shipping: float = 0
    fees: float = 0


class TransactionResponse(BaseModel):
    product: str
    display_name: str
    type: str
    quantity: int

    selling_price: float
    cost_price: float
    shipping: float
    fees: float

    total_revenue: float
    total_cost: float
    profit: float

    created_at: datetime


class TransactionItem(BaseModel):
    product: str
    display_name: str
    type: str
    quantity: int

    selling_price: float
    cost_price: float
    shipping: float
    fees: float

    total_revenue: float
    total_cost: float
    profit: float

    created_at: datetime


class TransactionsResponse(BaseModel):
    items: List[TransactionItem]


# =========================
# 🔹 INVENTORY MODELS
# =========================

class InventoryItem(BaseModel):
    name: str
    display_name: Optional[str] = None
    stock: int
    avg_cost: float
    updated_at: Optional[datetime]


class InventoryResponse(BaseModel):
    items: List[InventoryItem]


# =========================
# 🔹 REPORTS MODELS
# =========================

class TopProduct(BaseModel):
    product: str
    total_quantity: int


class ReportsResponse(BaseModel):
    total_profit: float
    total_revenue: float
    total_cost: float
    top_products: List[TopProduct]
from pydantic import BaseModel, Field
from typing import List, Optional
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
    # Security: Field constraints prevent empty strings, negative numbers, and invalid types
    product: str = Field(..., min_length=1, max_length=100, description="Product name")
    type: str = Field(..., pattern="^(sale|purchase)$", description="Must be sale or purchase")
    quantity: int = Field(..., gt=0, description="Quantity must be at least 1")
    
    selling_price: float = Field(default=0.0, ge=0.0, description="Cannot be negative")
    cost_price: float = Field(default=0.0, ge=0.0, description="Cannot be negative")
    shipping: float = Field(default=0.0, ge=0.0, description="Cannot be negative")
    fees: float = Field(default=0.0, ge=0.0, description="Cannot be negative")
    date: Optional[str] = None


class TransactionResponse(BaseModel):
    product: str
    display_name: str
    type: str
    quantity: int
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

# =========================
# 🔹 USER & AUTH MODELS
# =========================

class User(BaseModel):
    uid: str = Field(..., description="Firebase UID")
    email: str
    role: str = Field(default="user", pattern="^(admin|user|manager)$")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserResponse(BaseModel):
    uid: str
    email: str
    role: str

# =========================
# Update Transaction Request
# =========================
class TransactionRequest(BaseModel):
    # Security tracking: Which user does this belong to?
    user_id: str = Field(..., description="The Firebase UID of the user making the transaction")
    
    product: str = Field(..., min_length=1, max_length=100, description="Product name")
    type: str = Field(..., pattern="^(sale|purchase)$", description="Must be sale or purchase")
    quantity: int = Field(..., gt=0, description="Quantity must be at least 1")
    
    selling_price: float = Field(default=0.0, ge=0.0, description="Cannot be negative")
    cost_price: float = Field(default=0.0, ge=0.0, description="Cannot be negative")
    shipping: float = Field(default=0.0, ge=0.0, description="Cannot be negative")
    fees: float = Field(default=0.0, ge=0.0, description="Cannot be negative")
    date: Optional[str] = None
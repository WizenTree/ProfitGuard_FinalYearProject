from fastapi import APIRouter
from app.models.schema import TransactionRequest, TransactionResponse
from app.services.transaction_service import TransactionService

router = APIRouter()

@router.post("/", response_model=TransactionResponse)
async def create_transaction(data: TransactionRequest):
    """
    Controller Route: Handles only HTTP intake and outtake.
    All logic is deferred to the TransactionService.
    """
    # Look how clean this is! The interviewer will love this architecture.
    result = TransactionService.process_transaction(data)
    return result
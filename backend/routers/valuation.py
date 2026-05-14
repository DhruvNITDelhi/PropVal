"""
Valuation Router
=================

Handles the main /api/valuate endpoint that accepts property details
and returns a price prediction with confidence scoring.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import ValuationRequest, ValuationResponse
from engine.aggregator import valuate

router = APIRouter(prefix="/api", tags=["valuation"])


@router.post("/valuate", response_model=ValuationResponse)
async def create_valuation(request: ValuationRequest) -> ValuationResponse:
    """
    Generate a property valuation based on the provided details.
    
    Runs all three layers of the hybrid engine:
    - Layer 1: Deterministic rule engine
    - Layer 2: ML estimator
    - Layer 3: Confidence scoring
    
    Returns price range (lower/fair/upper), confidence percentage,
    and a transparent breakdown of all factors applied.
    """
    try:
        result = valuate(request)
        return result
    except KeyError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid input data: {str(e)}. Please check city/state names.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Valuation engine error: {str(e)}",
        )

"""
Layer 2: ML Estimator
======================

Provides a machine-learning-based property value estimate.

Phase 1 (current): Acts as a passthrough — returns the rule engine's
estimate directly. The architecture is ready for real model integration.

Phase 2 (future): When real transaction data is available, train a
GradientBoostingRegressor (or XGBoost) on features like city tier,
zone, area, property type, age, floor, BHK, quality, amenity score,
and geo score. The trained model file (.joblib) will be loaded here.

This separation ensures the ML layer can evolve independently without
affecting the rule engine or confidence scoring.
"""

from typing import Optional
from pathlib import Path


# In Phase 2, the trained model would be loaded here:
# MODEL_PATH = Path(__file__).parent.parent / "models" / "valuation_model.joblib"
# _model = joblib.load(MODEL_PATH) if MODEL_PATH.exists() else None

_model = None  # Placeholder for Phase 2


def predict(
    property_type: str,
    city: str,
    state: str,
    carpet_area_sqft: float,
    zone: Optional[str] = None,
    bhk: Optional[int] = None,
    floor: Optional[int] = None,
    age_years: Optional[int] = None,
    furnishing: Optional[str] = None,
    construction_quality: Optional[str] = None,
    amenity_score: float = 0.0,
    geo_score: float = 0.0,
    rule_engine_estimate: Optional[int] = None,
    **kwargs,
) -> dict:
    """
    Generate an ML-based property price estimate.
    
    Phase 1: Returns the rule engine estimate as a passthrough.
    Phase 2: Will use a trained sklearn model for prediction.
    
    Args:
        rule_engine_estimate: The estimate from Layer 1 (used as
            passthrough in Phase 1, and for model agreement scoring
            in Phase 2).
    
    Returns:
        dict with:
            - ml_estimate: int (predicted price)
            - model_available: bool (whether a real model was used)
            - model_version: str
    """
    if _model is not None:
        # Phase 2: Real model prediction
        # features = _build_feature_vector(...)
        # prediction = _model.predict([features])[0]
        # return {"ml_estimate": int(prediction), "model_available": True, "model_version": "v1.0"}
        pass

    # Phase 1: Passthrough to rule engine estimate
    return {
        "ml_estimate": rule_engine_estimate or 0,
        "model_available": False,
        "model_version": "passthrough-v0.1",
    }


def _build_feature_vector(
    property_type: str,
    city: str,
    carpet_area_sqft: float,
    zone: Optional[str],
    bhk: Optional[int],
    floor: Optional[int],
    age_years: Optional[int],
    furnishing: Optional[str],
    construction_quality: Optional[str],
    amenity_score: float,
    geo_score: float,
) -> list[float]:
    """
    Build a numeric feature vector for the ML model.
    
    Feature encoding:
        - Property type: one-hot (4 features)
        - City tier: ordinal (1=tier1, 2=tier2, 3=other)
        - Zone: ordinal (1=prime, 2=urban, 3=suburban, 4=rural)
        - Continuous: area, age, floor, bhk, amenity_score, geo_score
        - Quality: ordinal (1=basic, 2=standard, 3=premium)
        - Furnishing: ordinal (1=unfurnished, 2=semi, 3=furnished)
    
    This will be implemented in Phase 2 when training data is available.
    """
    # Placeholder — to be implemented with real feature engineering
    return []

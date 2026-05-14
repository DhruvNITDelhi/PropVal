"""
Layer 3: Confidence Engine
===========================

Scores the reliability of a valuation based on multiple factors:
- City tier (Tier-1 cities have more data → higher confidence)
- Number of optional fields the user filled
- Whether the locality is specifically known
- Agreement between Rule Engine and ML model
- Market volatility of the city

Output: confidence percentage (0-100), label, and market volatility.
"""

import json
from pathlib import Path
from typing import Optional

_DATA_DIR = Path(__file__).parent.parent / "data"

with open(_DATA_DIR / "multipliers.json", "r") as f:
    _CONFIG = json.load(f)


def _get_city_tier(city: str) -> str:
    """Classify a city into tier1, tier2, or other."""
    tiers = _CONFIG.get("city_tiers", {})
    if city in tiers.get("tier1", []):
        return "tier1"
    if city in tiers.get("tier2", []):
        return "tier2"
    return "other"


def _get_market_volatility(city: str) -> str:
    """Determine market volatility level for a city."""
    vol = _CONFIG.get("market_volatility", {})
    if city in vol.get("high", []):
        return "High"
    if city in vol.get("moderate", []):
        return "Moderate"
    return "Low"


def _count_optional_fields(**kwargs) -> int:
    """Count how many optional fields the user provided."""
    optional_fields = [
        "locality", "pincode", "zone", "buildup_area_sqft", "plot_area_sqft",
        "bhk", "floor", "total_floors", "washrooms", "parking",
        "age_years", "furnishing", "construction_quality",
    ]
    count = 0
    for field in optional_fields:
        val = kwargs.get(field)
        if val is not None and val != "" and val != 0:
            count += 1
    return count


def score(
    city: str,
    rule_estimate: int,
    ml_estimate: int,
    ml_model_available: bool,
    locality: Optional[str] = None,
    **kwargs,
) -> dict:
    """
    Calculate confidence score for a valuation.
    
    Returns:
        dict with:
            - confidence_pct: int (0-100)
            - confidence_label: "Low" | "Medium" | "High"
            - market_volatility: "Low" | "Moderate" | "High"
            - spread: float (percentage spread for range calculation)
    """
    weights = _CONFIG["confidence_weights"]
    score = weights["base_confidence"]  # Start with base

    # City tier bonus
    tier = _get_city_tier(city)
    score += weights["city_tier"].get(tier, weights["city_tier"]["other"])

    # Optional fields bonus (capped)
    filled = _count_optional_fields(locality=locality, **kwargs)
    field_bonus = min(filled * weights["fields_filled_bonus"], weights["max_field_bonus"])
    score += field_bonus

    # Locality specificity bonus
    if locality and locality.strip():
        score += weights["locality_known"]

    # ML model agreement bonus (Phase 2)
    if ml_model_available and rule_estimate > 0 and ml_estimate > 0:
        agreement_ratio = min(rule_estimate, ml_estimate) / max(rule_estimate, ml_estimate)
        if agreement_ratio > 0.90:
            score += weights["model_agreement"]
        elif agreement_ratio > 0.80:
            score += weights["model_agreement"] // 2

    # Cap at 95 (never show 100% confidence)
    score = min(score, 95)

    # Determine label
    if score >= 70:
        label = "High"
    elif score >= 50:
        label = "Medium"
    else:
        label = "Low"

    # Market volatility
    volatility = _get_market_volatility(city)

    # Adjust confidence down for high volatility
    if volatility == "High":
        score = max(score - 8, 20)

    # Determine price range spread
    spreads = _CONFIG["range_spread"]
    if label == "High":
        spread = spreads["high_confidence"]
    elif label == "Medium":
        spread = spreads["medium_confidence"]
    else:
        spread = spreads["low_confidence"]

    return {
        "confidence_pct": int(score),
        "confidence_label": label,
        "market_volatility": volatility,
        "spread": spread,
    }

"""
Layer 1: Deterministic Rule Engine
===================================

Applies a set of transparent, explainable multipliers to a base rate
to compute a property's estimated value. Each multiplier is tracked
so users can see exactly "why this estimate?" in the results.

Formula:
    price = base_rate_per_sqft × area × Π(multipliers)

All multiplier definitions are loaded from data/multipliers.json,
making them easy to update without code changes.
"""

import json
import math
from pathlib import Path
from typing import Optional

# Load multiplier config once at module level
_DATA_DIR = Path(__file__).parent.parent / "data"

with open(_DATA_DIR / "city_rates.json", "r") as f:
    CITY_RATES: dict = json.load(f)

with open(_DATA_DIR / "multipliers.json", "r") as f:
    MULTIPLIERS: dict = json.load(f)


def _get_base_rate(state: str, city: str, zone: Optional[str] = None) -> tuple[int, str]:
    """
    Look up the base rate (₹/sqft) for a given state, city, and zone.
    
    Returns:
        (base_rate, zone_label) — the applicable rate and which zone was used.
    """
    state_data = CITY_RATES.get(state, {})
    city_data = state_data.get("cities", {}).get(city, {})

    if not city_data:
        # Fallback: use state average if city not found
        return state_data.get("base_rate", 3000), "urban"

    if zone and zone in city_data.get("zones", {}):
        return city_data["zones"][zone], zone

    # Default to urban zone
    return city_data.get("base_rate", state_data.get("base_rate", 3000)), "urban"


def _get_age_depreciation(age_years: Optional[int], property_type: str) -> tuple[float, float]:
    """
    Calculate age-based depreciation factor.
    Land is exempt from depreciation.
    
    Returns:
        (factor, impact_pct) — the multiplier and its % impact.
    """
    if property_type == "land" or age_years is None or age_years == 0:
        return 1.0, 0.0

    cfg = MULTIPLIERS["age_depreciation"]
    factor = max(cfg["min_factor"], 1.0 - cfg["rate_per_year"] * age_years)
    impact = round((factor - 1.0) * 100, 1)
    return factor, impact


def _get_floor_premium(floor: Optional[int], total_floors: Optional[int]) -> tuple[float, str]:
    """
    Determine floor-level price premium.
    
    Returns:
        (factor, floor_label) — the multiplier and the floor tier label.
    """
    if floor is None:
        return 1.0, "N/A"

    fp = MULTIPLIERS["floor_premium"]
    ranges = MULTIPLIERS["floor_ranges"]

    # Check if it's the top floor
    if total_floors and floor >= total_floors:
        return fp["top_floor"], "top_floor"

    for tier, bounds in ranges.items():
        if tier == "top_floor":
            continue
        if isinstance(bounds, list) and bounds[0] <= floor <= bounds[1]:
            return fp[tier], tier

    return 1.0, "unknown"


def calculate(
    property_type: str,
    state: str,
    city: str,
    carpet_area_sqft: float,
    zone: Optional[str] = None,
    bhk: Optional[int] = None,
    floor: Optional[int] = None,
    total_floors: Optional[int] = None,
    age_years: Optional[int] = None,
    furnishing: Optional[str] = None,
    construction_quality: Optional[str] = None,
    is_corner: bool = False,
    main_road_access: bool = False,
    park_facing: bool = False,
    metro_nearby: bool = False,
    gated_community: bool = False,
    has_lift: bool = False,
    power_backup: bool = False,
    **kwargs,
) -> dict:
    """
    Run the deterministic rule engine to estimate property value.
    
    Returns a dict with:
        - estimated_price: int
        - per_sqft_rate: int
        - base_rate: int
        - factors: list of applied factor dicts
        - total_multiplier: float
    """
    factors = []

    # 1. Base rate lookup
    base_rate, zone_label = _get_base_rate(state, city, zone)
    factors.append({
        "name": f"Base locality rate ({city}, {zone_label})",
        "value": f"₹{base_rate:,}/sqft",
        "impact_pct": None,
        "direction": "neutral",
    })

    total_multiplier = 1.0

    # 2. Property type factor
    pt_factor = MULTIPLIERS["property_type"].get(property_type, 1.0)
    if pt_factor != 1.0:
        impact = round((pt_factor - 1.0) * 100, 1)
        factors.append({
            "name": f"Property type ({property_type})",
            "impact_pct": impact,
            "direction": "positive" if impact > 0 else "negative",
        })
    total_multiplier *= pt_factor

    # 3. Age depreciation
    age_factor, age_impact = _get_age_depreciation(age_years, property_type)
    if age_impact != 0.0:
        factors.append({
            "name": f"Property age ({age_years} years)",
            "impact_pct": age_impact,
            "direction": "negative",
        })
    total_multiplier *= age_factor

    # 4. Floor premium
    if property_type in ("apartment", "commercial") and floor is not None:
        floor_factor, floor_label = _get_floor_premium(floor, total_floors)
        if floor_factor != 1.0:
            impact = round((floor_factor - 1.0) * 100, 1)
            factors.append({
                "name": f"Floor level ({floor_label}, floor {floor})",
                "impact_pct": impact,
                "direction": "positive" if impact > 0 else "negative",
            })
        total_multiplier *= floor_factor

    # 5. BHK factor
    if bhk and property_type in ("apartment", "house"):
        bhk_factor = MULTIPLIERS["bhk_factor"].get(str(min(bhk, 5)), 1.0)
        if bhk_factor != 1.0:
            impact = round((bhk_factor - 1.0) * 100, 1)
            factors.append({
                "name": f"Configuration ({bhk} BHK)",
                "impact_pct": impact,
                "direction": "positive" if impact > 0 else "negative",
            })
        total_multiplier *= bhk_factor

    # 6. Construction quality
    if construction_quality:
        cq_factor = MULTIPLIERS["construction_quality"].get(construction_quality, 1.0)
        if cq_factor != 1.0:
            impact = round((cq_factor - 1.0) * 100, 1)
            factors.append({
                "name": f"Construction quality ({construction_quality})",
                "impact_pct": impact,
                "direction": "positive" if impact > 0 else "negative",
            })
        total_multiplier *= cq_factor

    # 7. Furnishing status
    if furnishing:
        furn_factor = MULTIPLIERS["furnishing"].get(furnishing, 1.0)
        if furn_factor != 1.0:
            impact = round((furn_factor - 1.0) * 100, 1)
            factors.append({
                "name": f"Furnishing ({furnishing})",
                "impact_pct": impact,
                "direction": "positive",
            })
        total_multiplier *= furn_factor

    # 8. Boolean premium factors
    bool_premiums = MULTIPLIERS["boolean_premiums"]
    bool_fields = {
        "is_corner": ("Corner plot", is_corner),
        "main_road_access": ("Main road access", main_road_access),
        "park_facing": ("Park / garden facing", park_facing),
        "metro_nearby": ("Metro proximity", metro_nearby),
        "gated_community": ("Gated community", gated_community),
        "has_lift": ("Lift available", has_lift),
        "power_backup": ("Power backup", power_backup),
    }

    for key, (label, is_active) in bool_fields.items():
        if is_active and key in bool_premiums:
            premium = bool_premiums[key]
            factors.append({
                "name": label,
                "impact_pct": round(premium * 100, 1),
                "direction": "positive",
            })
            total_multiplier *= (1.0 + premium)

    # Calculate final price
    effective_rate = base_rate * total_multiplier
    estimated_price = int(carpet_area_sqft * effective_rate)

    return {
        "estimated_price": estimated_price,
        "per_sqft_rate": int(effective_rate),
        "base_rate": base_rate,
        "zone_label": zone_label,
        "factors": factors,
        "total_multiplier": round(total_multiplier, 4),
    }

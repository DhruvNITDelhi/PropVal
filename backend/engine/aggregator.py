"""
Valuation Aggregator
=====================

Orchestrates all three layers of the hybrid valuation engine:
1. Rule Engine → deterministic base estimate
2. ML Estimator → pattern-based estimate (passthrough in Phase 1)
3. Confidence Engine → reliability scoring + range calculation

This module is the single entry point called by the API router.
"""

from engine import rule_engine, ml_estimator, confidence, geo_engine
from models.schemas import ValuationRequest, ValuationResponse, FactorApplied


def valuate(request: ValuationRequest) -> ValuationResponse:
    """
    Run the full hybrid valuation pipeline.
    
    Steps:
        1. Run Layer 1 (Rule Engine) to get base estimate + factor breakdown
        2. Run Layer 2 (ML Estimator) for pattern-based estimate
        3. Run Layer 3 (Confidence Engine) for reliability scoring
        4. Calculate price range using confidence-based spread
        5. Assemble the final response with full transparency
    
    Args:
        request: Validated ValuationRequest from the API
    
    Returns:
        ValuationResponse with price range, confidence, and breakdown
    """
    # Extract all inputs as a dict for easier passing
    inputs = request.model_dump()

    # ── Layer 0: Geo Engine ───────────────────────────────────────────────
    lat = getattr(request, 'lat', None)
    lng = getattr(request, 'lng', None)
    geo_features = geo_engine.extract_features(request.city, lat, lng)
    
    # Auto-detect metro proximity (within 2km)
    metro_nearby = request.metro_nearby or False
    if geo_features.get("metro_distance_km") is not None and geo_features["metro_distance_km"] <= 2.0:
        metro_nearby = True

    # ── Layer 1: Rule Engine ──────────────────────────────────────────────
    rule_result = rule_engine.calculate(
        property_type=request.property_type.value,
        state=request.state,
        city=request.city,
        carpet_area_sqft=request.carpet_area_sqft,
        zone=request.zone.value if request.zone else None,
        bhk=request.bhk,
        floor=request.floor,
        total_floors=request.total_floors,
        age_years=request.age_years,
        furnishing=request.furnishing.value if request.furnishing else None,
        construction_quality=request.construction_quality.value if request.construction_quality else None,
        is_corner=request.is_corner or False,
        main_road_access=request.main_road_access or False,
        park_facing=request.park_facing or False,
        metro_nearby=metro_nearby,
        gated_community=request.gated_community or False,
        has_lift=request.has_lift or False,
        power_backup=request.power_backup or False,
        geo_features=geo_features,
    )

    rule_estimate = rule_result["estimated_price"]

    # ── Layer 2: ML Estimator ─────────────────────────────────────────────
    ml_result = ml_estimator.predict(
        property_type=request.property_type.value,
        city=request.city,
        state=request.state,
        carpet_area_sqft=request.carpet_area_sqft,
        rule_engine_estimate=rule_estimate,
    )

    # ── Layer 3: Confidence Engine ────────────────────────────────────────
    conf_result = confidence.score(
        city=request.city,
        rule_estimate=rule_estimate,
        ml_estimate=ml_result["ml_estimate"],
        ml_model_available=ml_result["model_available"],
        locality=request.locality,
        pincode=request.pincode,
        zone=request.zone.value if request.zone else None,
        buildup_area_sqft=request.buildup_area_sqft,
        plot_area_sqft=request.plot_area_sqft,
        bhk=request.bhk,
        floor=request.floor,
        total_floors=request.total_floors,
        washrooms=request.washrooms,
        parking=request.parking,
        age_years=request.age_years,
        furnishing=request.furnishing.value if request.furnishing else None,
        construction_quality=request.construction_quality.value if request.construction_quality else None,
    )

    # ── Calculate Price Range ─────────────────────────────────────────────
    # Use the rule engine estimate as the fair estimate
    # (In Phase 2, this could be a weighted average of L1 and L2)
    fair_estimate = rule_estimate
    spread = conf_result["spread"]

    lower_estimate = int(fair_estimate * (1 - spread))
    upper_estimate = int(fair_estimate * (1 + spread))

    # ── Get city average for comparison ───────────────────────────────────
    city_avg = rule_engine._get_base_rate(request.state, request.city)[0]

    # ── Assemble factors list ─────────────────────────────────────────────
    factors = [FactorApplied(**f) for f in rule_result["factors"]]

    # ── Build Response ────────────────────────────────────────────────────
    # Format property type label
    type_labels = {
        "apartment": "Apartment",
        "house": "Independent House",
        "land": "Plot / Land",
        "commercial": "Commercial Building",
    }

    return ValuationResponse(
        lower_estimate=lower_estimate,
        fair_estimate=fair_estimate,
        upper_estimate=upper_estimate,
        per_sqft_rate=rule_result["per_sqft_rate"],
        confidence_pct=conf_result["confidence_pct"],
        confidence_label=conf_result["confidence_label"],
        market_volatility=conf_result["market_volatility"],
        factors_applied=factors,
        city_average_psf=city_avg,
        zone_label=rule_result["zone_label"],
        property_type_label=type_labels.get(request.property_type.value, "Property"),
        data_quality_note="Based on government circle rates + market adjustments. Not a certified valuation.",
    )

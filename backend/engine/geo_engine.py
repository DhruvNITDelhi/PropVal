"""
GIS / Geo Engine
=================

Extracts geographic features for a property location and converts
them into a geo_score that influences the valuation.

Phase 1: Uses pre-compiled POI data (metro stations, airports,
railway stations) with Haversine distance calculations.

Phase 2: Will integrate OpenStreetMap Overpass API for live queries
(school/hospital density, flood zone detection, etc.)
"""

import json
import math
from pathlib import Path
from typing import Optional

_DATA_DIR = Path(__file__).parent.parent / "data"

with open(_DATA_DIR / "geo_poi.json", "r") as f:
    GEO_POI: dict = json.load(f)


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate the great-circle distance between two points in km."""
    R = 6371  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(dlon / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def _nearest_poi(lat: float, lon: float, poi_list: list[dict]) -> tuple[float, str]:
    """Find the nearest POI and return (distance_km, name)."""
    if not poi_list:
        return float("inf"), "N/A"

    nearest_dist = float("inf")
    nearest_name = "N/A"

    for poi in poi_list:
        dist = _haversine_km(lat, lon, poi["lat"], poi["lon"])
        if dist < nearest_dist:
            nearest_dist = dist
            nearest_name = poi["name"]

    return round(nearest_dist, 2), nearest_name


def extract_features(city: str, lat: Optional[float] = None, lon: Optional[float] = None) -> dict:
    """
    Extract geographic features for a property location.
    
    If lat/lon are not provided, returns neutral scores.
    
    Returns:
        dict with:
            - metro_distance_km: float
            - nearest_metro: str
            - airport_distance_km: float
            - nearest_airport: str
            - railway_distance_km: float
            - nearest_railway: str
            - geo_score: float (0-1, higher = better location)
    """
    if lat is None or lon is None:
        return {
            "metro_distance_km": None,
            "nearest_metro": None,
            "airport_distance_km": None,
            "nearest_airport": None,
            "railway_distance_km": None,
            "nearest_railway": None,
            "geo_score": 0.5,  # Neutral when no coordinates
        }

    # Metro station distance
    metro_stations = GEO_POI.get("metro_stations", {}).get(city, [])
    metro_dist, metro_name = _nearest_poi(lat, lon, metro_stations)

    # Airport distance
    airports = GEO_POI.get("airports", [])
    airport_dist, airport_name = _nearest_poi(lat, lon, airports)

    # Railway station distance
    railways = GEO_POI.get("railway_stations", [])
    railway_dist, railway_name = _nearest_poi(lat, lon, railways)

    # Calculate composite geo score (0-1)
    # Closer to infrastructure = higher score
    metro_score = max(0, 1.0 - metro_dist / 10) if metro_dist != float("inf") else 0.3
    airport_score = max(0, 1.0 - airport_dist / 30) if airport_dist != float("inf") else 0.3
    railway_score = max(0, 1.0 - railway_dist / 15) if railway_dist != float("inf") else 0.3

    # Weighted composite (metro most important for property value)
    geo_score = round(metro_score * 0.5 + airport_score * 0.2 + railway_score * 0.3, 3)
    geo_score = max(0.1, min(1.0, geo_score))

    return {
        "metro_distance_km": metro_dist if metro_dist != float("inf") else None,
        "nearest_metro": metro_name if metro_name != "N/A" else None,
        "airport_distance_km": airport_dist if airport_dist != float("inf") else None,
        "nearest_airport": airport_name if airport_name != "N/A" else None,
        "railway_distance_km": railway_dist if railway_dist != float("inf") else None,
        "nearest_railway": railway_name if railway_name != "N/A" else None,
        "geo_score": geo_score,
    }

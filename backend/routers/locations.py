"""
Locations Router
=================

Serves state and city data from city_rates.json for the
questionnaire's cascading dropdowns (State → City → Zone).
"""

import json
from pathlib import Path
from fastapi import APIRouter

router = APIRouter(prefix="/api", tags=["locations"])

_DATA_DIR = Path(__file__).parent.parent / "data"
with open(_DATA_DIR / "city_rates.json", "r") as f:
    _CITY_DATA: dict = json.load(f)


@router.get("/states")
async def list_states() -> list[dict]:
    """Return all states sorted alphabetically with city counts."""
    states = []
    for state_name, state_data in _CITY_DATA.items():
        cities = state_data.get("cities", {})
        states.append({
            "name": state_name,
            "city_count": len(cities),
        })
    return sorted(states, key=lambda s: s["name"])


@router.get("/cities/{state}")
async def list_cities(state: str) -> list[dict]:
    """Return all cities in a state with base rates and available zones."""
    state_data = _CITY_DATA.get(state, {})
    cities = state_data.get("cities", {})

    result = []
    for city_name, city_data in cities.items():
        zones = list(city_data.get("zones", {}).keys())
        result.append({
            "name": city_name,
            "base_rate": city_data.get("base_rate", 0),
            "zones": zones,
        })
    return sorted(result, key=lambda c: c["name"])


@router.get("/localities/{city}")
async def list_localities(city: str) -> list[str]:
    """
    Return known locality zone types for a city.
    Phase 2: Will return actual locality names from database.
    """
    # Find the city in any state
    for state_data in _CITY_DATA.values():
        city_data = state_data.get("cities", {}).get(city)
        if city_data:
            return list(city_data.get("zones", {}).keys())
    return ["prime", "urban", "suburban", "rural"]

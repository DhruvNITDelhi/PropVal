"""
Pydantic schemas for PropVal API request/response validation.

These models define the contract between the frontend and backend,
ensuring type safety and automatic validation of all API payloads.
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum


# ─── Enums ────────────────────────────────────────────────────────────────────

class PropertyType(str, Enum):
    """Supported property types for valuation."""
    APARTMENT = "apartment"
    HOUSE = "house"
    LAND = "land"
    COMMERCIAL = "commercial"


class FurnishingStatus(str, Enum):
    """Property furnishing levels."""
    UNFURNISHED = "unfurnished"
    SEMI = "semi"
    FURNISHED = "furnished"


class ConstructionQuality(str, Enum):
    """Construction quality tiers affecting valuation."""
    BASIC = "basic"
    STANDARD = "standard"
    PREMIUM = "premium"


class ZoneType(str, Enum):
    """Locality zone classification."""
    PRIME = "prime"
    URBAN = "urban"
    SUBURBAN = "suburban"
    RURAL = "rural"


# ─── Request Models ──────────────────────────────────────────────────────────

class ValuationRequest(BaseModel):
    """
    Main valuation request payload.
    
    Only property_type, city, state, and carpet_area_sqft are required.
    All other fields are optional and improve accuracy when provided.
    """
    # Step 1: Property Type (required)
    property_type: PropertyType

    # Step 2: Location (required)
    city: str = Field(..., min_length=1, description="City name")
    state: str = Field(..., min_length=1, description="State name")
    locality: Optional[str] = Field(None, description="Locality or area name")
    pincode: Optional[str] = Field(None, pattern=r"^\d{6}$", description="6-digit pincode")
    zone: Optional[ZoneType] = Field(None, description="Zone classification")
    lat: Optional[float] = Field(None, ge=8.0, le=37.0, description="Latitude (India)")
    lng: Optional[float] = Field(None, ge=68.0, le=97.0, description="Longitude (India)")

    # Step 3: Size (carpet_area required)
    carpet_area_sqft: float = Field(..., gt=0, le=100000, description="Carpet area in sq.ft")
    buildup_area_sqft: Optional[float] = Field(None, gt=0, le=150000)
    plot_area_sqft: Optional[float] = Field(None, gt=0, le=500000)

    # Step 4: Core Details (all optional)
    bhk: Optional[int] = Field(None, ge=1, le=10)
    floor: Optional[int] = Field(None, ge=0, le=100)
    total_floors: Optional[int] = Field(None, ge=1, le=100)
    washrooms: Optional[int] = Field(None, ge=1, le=10)
    parking: Optional[int] = Field(None, ge=0, le=5)

    # Step 5: Condition (all optional)
    age_years: Optional[int] = Field(None, ge=0, le=100)
    furnishing: Optional[FurnishingStatus] = None
    construction_quality: Optional[ConstructionQuality] = None

    # Step 6: Premium Factors (all optional booleans)
    is_corner: Optional[bool] = False
    main_road_access: Optional[bool] = False
    park_facing: Optional[bool] = False
    metro_nearby: Optional[bool] = False
    gated_community: Optional[bool] = False
    has_lift: Optional[bool] = False
    power_backup: Optional[bool] = False


# ─── Response Models ─────────────────────────────────────────────────────────

class FactorApplied(BaseModel):
    """Individual pricing factor shown in the 'Why this estimate?' breakdown."""
    name: str
    value: Optional[str] = None
    impact_pct: Optional[float] = None
    direction: Optional[Literal["positive", "negative", "neutral"]] = None


class ValuationResponse(BaseModel):
    """
    Complete valuation result returned to the frontend.
    
    Includes price range, confidence scoring, and a transparent
    breakdown of every factor that influenced the estimate.
    """
    # Price estimates
    lower_estimate: int = Field(..., description="Conservative estimate (₹)")
    fair_estimate: int = Field(..., description="Most likely value (₹)")
    upper_estimate: int = Field(..., description="Optimistic estimate (₹)")
    per_sqft_rate: int = Field(..., description="Effective ₹/sq.ft rate")

    # Confidence & market context
    confidence_pct: int = Field(..., ge=0, le=100)
    confidence_label: Literal["Low", "Medium", "High"]
    market_volatility: Literal["Low", "Moderate", "High"]

    # Breakdown for transparency
    factors_applied: list[FactorApplied]

    # City comparison
    city_average_psf: int
    zone_label: str
    property_type_label: str

    # Metadata
    data_quality_note: str = "Based on government circle rates + market adjustments"


class StateResponse(BaseModel):
    """State list item."""
    name: str
    city_count: int


class CityResponse(BaseModel):
    """City list item within a state."""
    name: str
    base_rate: int
    zones: list[str]

"""
PropVal — FastAPI Backend Application
=======================================

Main application entry point. Configures CORS, registers routers,
and provides the health check endpoint.

Run with:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import valuation, locations

# ─── App Configuration ────────────────────────────────────────────────────────

app = FastAPI(
    title="PropVal API",
    description=(
        "Hybrid property valuation engine for Indian real estate. "
        "Combines deterministic rules, ML estimation, and confidence scoring "
        "to predict property prices across 100+ Indian cities."
    ),
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS (allow Next.js frontend) ───────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",     # Next.js dev server
        "http://127.0.0.1:3000",
        "https://propval.vercel.app", # Future production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routers ────────────────────────────────────────────────────────

app.include_router(valuation.router)
app.include_router(locations.router)


# ─── Health Check ─────────────────────────────────────────────────────────────

@app.get("/health", tags=["system"])
async def health_check():
    """
    Health check endpoint for monitoring and deployment verification.
    Returns API version and engine status.
    """
    return {
        "status": "healthy",
        "version": "0.1.0",
        "engine": {
            "rule_engine": "active",
            "ml_estimator": "passthrough (Phase 1)",
            "confidence_engine": "active",
            "geo_engine": "active (pre-compiled POI)",
        },
    }

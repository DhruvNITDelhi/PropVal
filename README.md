<![CDATA[# PropVal — AI-Powered Property Price Predictor (Pan India)

<p align="center">
  <strong>Know Your Property's True Worth — Instantly</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Overview

**PropVal** is an intelligent property valuation platform that predicts prices for land, houses, apartments, and commercial buildings across **100+ Indian cities**. It uses a **3-layer hybrid valuation engine** combining deterministic rules, ML estimation, and confidence scoring to deliver transparent, range-based price predictions.

Users answer a streamlined **6-step questionnaire** (under 90 seconds) and receive:
- **Price range** (Lower / Fair / Upper estimate)
- **Confidence score** with market volatility indicator
- **"Why this estimate?"** — full breakdown of every factor affecting the price

## Features

- 🏠 **4 Property Types** — Apartment, Independent House, Plot/Land, Commercial
- 🇮🇳 **100+ Indian Cities** — All metros, Tier-1, Tier-2, and key Tier-3 cities
- 🧠 **Hybrid Valuation Engine** — Rules + ML + Confidence scoring
- 📍 **GIS Intelligence** — Metro, airport, railway proximity factored in
- 📊 **Transparent Pricing** — Every multiplier shown with its +/- impact
- 📱 **PWA** — Install on any device, works offline for static content
- ⚡ **Fast** — Results in under 2 seconds

## Architecture

```
PropVal/
├── frontend/          # Next.js + TypeScript + Tailwind + Framer Motion
│   ├── src/app/       # App Router pages (Landing, Valuation, Results)
│   ├── src/components # UI components, questionnaire steps, result cards
│   ├── src/lib/       # API client, types, constants
│   └── src/hooks/     # Custom React hooks
│
├── backend/           # FastAPI (Python)
│   ├── routers/       # API endpoints (valuation, locations, geo)
│   ├── engine/        # 3-layer hybrid valuation engine
│   │   ├── rule_engine.py     # Layer 1: Deterministic rules
│   │   ├── ml_estimator.py    # Layer 2: ML model (sklearn)
│   │   ├── confidence.py      # Layer 3: Confidence scoring
│   │   ├── geo_engine.py      # GIS feature extraction
│   │   └── aggregator.py      # Combines all layers
│   ├── data/          # City rates, multipliers, POI data
│   └── models/        # Pydantic schemas
│
└── docs/              # Additional documentation
```

### Hybrid Valuation Engine

| Layer | Purpose | Technology |
|-------|---------|-----------|
| **Layer 1: Rule Engine** | Deterministic pricing with 12+ multipliers (zone, age, floor, amenities, etc.) | Pure Python |
| **Layer 2: ML Estimator** | Pattern discovery and interaction effects | scikit-learn (GBR) |
| **Layer 3: Confidence Engine** | Scores reliability based on data completeness, model agreement, market volatility | Scoring algorithm |

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- **npm** (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/DhruvNITDelhi/PropVal.git
cd PropVal
```

### 2. Start the Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at `http://localhost:3000`.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/states` | List all Indian states |
| `GET` | `/api/cities/{state}` | Cities for a given state |
| `GET` | `/api/localities/{city}` | Known localities/zones for a city |
| `POST` | `/api/valuate` | **Main valuation endpoint** |
| `GET` | `/health` | Health check |

### POST `/api/valuate` — Example

```json
{
  "property_type": "apartment",
  "city": "Pune",
  "state": "Maharashtra",
  "locality": "Baner",
  "carpet_area_sqft": 850,
  "bhk": 2,
  "floor": 7,
  "total_floors": 14,
  "age_years": 5,
  "furnishing": "semi",
  "construction_quality": "standard",
  "gated_community": true,
  "metro_nearby": true
}
```

### Response

```json
{
  "lower_estimate": 8500000,
  "fair_estimate": 9900000,
  "upper_estimate": 10800000,
  "per_sqft_rate": 9350,
  "confidence_pct": 72,
  "confidence_label": "Medium",
  "market_volatility": "Moderate",
  "factors_applied": [
    { "name": "Base locality rate", "value": "₹8,200/sqft" },
    { "name": "Metro proximity", "impact_pct": 8, "direction": "positive" },
    { "name": "Gated community", "impact_pct": 7, "direction": "positive" },
    { "name": "Property age (5 years)", "impact_pct": -4, "direction": "negative" }
  ]
}
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS 4, Framer Motion |
| Backend | FastAPI, Python 3.10+, scikit-learn |
| Data | JSON (Phase 1), PostgreSQL + PostGIS (Phase 2) |
| Hosting | Vercel (frontend), Any Python host (backend) |
| PWA | next-pwa, Service Worker |

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/DhruvNITDelhi">Dhruv</a>
</p>
]]>

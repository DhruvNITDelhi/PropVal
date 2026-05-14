# Contributing to PropVal

Thank you for your interest in contributing to PropVal! This document provides guidelines and instructions for contributing.

## Project Structure

```
PropVal/
├── frontend/     # Next.js + TypeScript (UI, questionnaire, results)
├── backend/      # FastAPI + Python (valuation engine, API)
└── docs/         # Documentation
```

## Development Setup

### Prerequisites
- Node.js ≥ 18, npm
- Python ≥ 3.10

### Frontend
```bash
cd frontend
npm install
npm run dev         # Development server on :3000
npm run build       # Production build
npm run lint        # ESLint check
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload    # Development server on :8000
```

## Code Style

### TypeScript (Frontend)
- Use functional components with hooks
- Type all props and state
- Use `src/lib/types.ts` for shared interfaces
- Components go in `src/components/<category>/`

### Python (Backend)
- Follow PEP 8
- Use type hints for all function signatures
- Use Pydantic models for request/response validation
- Keep engine modules independent (no circular imports)

## Architecture Guidelines

### Decoupled Design
The valuation engine is intentionally decoupled from the API layer:

```
routers/ → engine/aggregator.py → rule_engine.py
                                 → ml_estimator.py
                                 → confidence.py
                                 → geo_engine.py
```

**Why?** The engine's multipliers, weights, and logic will evolve frequently. Keeping it modular means you can:
- Modify pricing logic without touching the API
- Swap the ML model without affecting rules
- Add new geo features independently

### Adding a New City
1. Edit `backend/data/city_rates.json`
2. Add the city under its state with `base_rate` and `zones` (prime/urban/suburban/rural)
3. Optionally add POI data in `backend/data/geo_poi.json`

### Adding a New Multiplier
1. Define the factor in `backend/data/multipliers.json`
2. Add application logic in `backend/engine/rule_engine.py`
3. Update `backend/models/schemas.py` to accept the new input field
4. Add UI for the field in the appropriate questionnaire step

## Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-multiplier`)
3. Write clear commit messages
4. Ensure `npm run build` passes (frontend)
5. Ensure the FastAPI server starts without errors (backend)
6. Submit a PR with a clear description of changes

## Reporting Issues

Use GitHub Issues. Please include:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS details
- Screenshots if UI-related

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

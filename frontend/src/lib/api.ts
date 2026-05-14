/**
 * API client for PropVal backend.
 *
 * All backend communication goes through this module.
 * In development, requests go to localhost:8000.
 * In production, update BACKEND_URL to the deployed API.
 */

import type { ValuationResult, StateInfo, CityInfo, FormData } from "./types";

let BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// Remove trailing slash if present to prevent // in endpoints
if (BACKEND_URL.endsWith('/')) {
  BACKEND_URL = BACKEND_URL.slice(0, -1);
}

/**
 * Generic fetch wrapper with error handling.
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API error: ${res.status}`);
  }

  return res.json();
}

// ─── Location Endpoints ──────────────────────────────────────────────────────

export async function fetchStates(): Promise<StateInfo[]> {
  return fetchAPI<StateInfo[]>("/api/states");
}

export async function fetchCities(state: string): Promise<CityInfo[]> {
  return fetchAPI<CityInfo[]>(`/api/cities/${encodeURIComponent(state)}`);
}

export async function fetchLocalities(city: string): Promise<string[]> {
  return fetchAPI<string[]>(`/api/localities/${encodeURIComponent(city)}`);
}

// ─── Valuation Endpoint ──────────────────────────────────────────────────────

/**
 * Submit a valuation request and receive the price prediction.
 *
 * Filters out empty/default values before sending to avoid
 * confusing the backend with null-like strings.
 */
export async function submitValuation(
  formData: FormData
): Promise<ValuationResult> {
  // Clean the payload: remove empty strings and convert to proper types
  const payload: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(formData)) {
    if (value === "" || value === null || value === undefined) continue;
    payload[key] = value;
  }

  return fetchAPI<ValuationResult>("/api/valuate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ─── Health Check ────────────────────────────────────────────────────────────

export async function checkHealth(): Promise<{ status: string }> {
  return fetchAPI<{ status: string }>("/health");
}

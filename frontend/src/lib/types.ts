/**
 * Shared TypeScript interfaces for PropVal.
 *
 * These types are used across components, hooks, and the API layer
 * to ensure type safety throughout the frontend.
 */

// ─── Enums / Literals ─────────────────────────────────────────────────────────

export type PropertyType = "apartment" | "house" | "land" | "commercial";
export type FurnishingStatus = "unfurnished" | "semi" | "furnished";
export type ConstructionQuality = "basic" | "standard" | "premium";
export type ZoneType = "prime" | "urban" | "suburban" | "rural";
export type ConfidenceLabel = "Low" | "Medium" | "High";
export type VolatilityLevel = "Low" | "Moderate" | "High";

// ─── Questionnaire Form Data ─────────────────────────────────────────────────

/** Complete form state collected across all 6 questionnaire steps. */
export interface FormData {
  // Step 1
  property_type: PropertyType | "";
  // Step 2
  state: string;
  city: string;
  locality: string;
  pincode: string;
  zone: ZoneType | "";
  // Step 3
  carpet_area_sqft: number | "";
  buildup_area_sqft: number | "";
  plot_area_sqft: number | "";
  // Step 4
  bhk: number | "";
  floor: number | "";
  total_floors: number | "";
  washrooms: number | "";
  parking: number | "";
  // Step 5
  age_years: number | "";
  furnishing: FurnishingStatus | "";
  construction_quality: ConstructionQuality | "";
  // Step 6
  is_corner: boolean;
  main_road_access: boolean;
  park_facing: boolean;
  metro_nearby: boolean;
  gated_community: boolean;
  has_lift: boolean;
  power_backup: boolean;
}

// ─── API Response Types ──────────────────────────────────────────────────────

/** Individual pricing factor in the "Why this estimate?" breakdown. */
export interface FactorApplied {
  name: string;
  value?: string | null;
  impact_pct?: number | null;
  direction?: "positive" | "negative" | "neutral" | null;
}

/** Complete valuation response from the backend. */
export interface ValuationResult {
  lower_estimate: number;
  fair_estimate: number;
  upper_estimate: number;
  per_sqft_rate: number;
  confidence_pct: number;
  confidence_label: ConfidenceLabel;
  market_volatility: VolatilityLevel;
  factors_applied: FactorApplied[];
  city_average_psf: number;
  zone_label: string;
  property_type_label: string;
  data_quality_note: string;
}

/** State list item from /api/states */
export interface StateInfo {
  name: string;
  city_count: number;
}

/** City list item from /api/cities/{state} */
export interface CityInfo {
  name: string;
  base_rate: number;
  zones: string[];
}

// ─── Component Props ─────────────────────────────────────────────────────────

/** Props shared by all questionnaire step components. */
export interface StepProps {
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
}

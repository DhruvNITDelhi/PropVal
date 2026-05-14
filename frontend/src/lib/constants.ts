/**
 * UI constants used across PropVal components.
 */

/** Property type options shown as visual cards in Step 1. */
export const PROPERTY_TYPES = [
  { value: "apartment" as const, label: "Apartment", icon: "🏢", desc: "Flat in a multi-story building" },
  { value: "house" as const, label: "Independent House", icon: "🏠", desc: "Standalone house / villa" },
  { value: "land" as const, label: "Plot / Land", icon: "🏗️", desc: "Vacant plot or agricultural land" },
  { value: "commercial" as const, label: "Commercial", icon: "🏬", desc: "Shop, office, or warehouse" },
];

/** Zone types with descriptions. */
export const ZONE_TYPES = [
  { value: "prime" as const, label: "Prime", desc: "Central business district, premium area" },
  { value: "urban" as const, label: "Urban", desc: "Established city area with good infra" },
  { value: "suburban" as const, label: "Suburban", desc: "Developing area on city outskirts" },
  { value: "rural" as const, label: "Rural", desc: "Village or peri-urban area" },
];

/** BHK options. */
export const BHK_OPTIONS = [1, 2, 3, 4, 5];

/** Construction quality options. */
export const QUALITY_OPTIONS = [
  { value: "basic" as const, label: "Basic", desc: "Standard materials, basic finish" },
  { value: "standard" as const, label: "Standard", desc: "Good quality, modern amenities" },
  { value: "premium" as const, label: "Premium", desc: "Luxury finish, imported materials" },
];

/** Furnishing options. */
export const FURNISHING_OPTIONS = [
  { value: "unfurnished" as const, label: "Unfurnished" },
  { value: "semi" as const, label: "Semi-Furnished" },
  { value: "furnished" as const, label: "Fully Furnished" },
];

/** Premium factor toggles for Step 6. */
export const PREMIUM_FACTORS = [
  { key: "is_corner" as const, label: "Corner Plot", icon: "📐" },
  { key: "main_road_access" as const, label: "Main Road Access", icon: "🛣️" },
  { key: "park_facing" as const, label: "Park / Garden Facing", icon: "🌳" },
  { key: "gated_community" as const, label: "Gated Community", icon: "🔒" },
  { key: "has_lift" as const, label: "Lift Available", icon: "🛗" },
  { key: "power_backup" as const, label: "Power Backup", icon: "⚡" },
];

/** Total number of questionnaire steps. */
export const TOTAL_STEPS = 6;

/** Step titles for the progress bar. */
export const STEP_TITLES = [
  "Property Type",
  "Location",
  "Size",
  "Details",
  "Condition",
  "Premium Factors",
];

/** Default (empty) form state. */
export const INITIAL_FORM_DATA = {
  property_type: "" as const,
  state: "",
  city: "",
  locality: "",
  pincode: "",
  zone: "" as const,
  lat: null,
  lng: null,
  carpet_area_sqft: "" as const,
  buildup_area_sqft: "" as const,
  plot_area_sqft: "" as const,
  bhk: "" as const,
  floor: "" as const,
  total_floors: "" as const,
  washrooms: "" as const,
  parking: "" as const,
  age_years: "" as const,
  furnishing: "" as const,
  construction_quality: "" as const,
  is_corner: false,
  main_road_access: false,
  park_facing: false,
  metro_nearby: false,
  gated_community: false,
  has_lift: false,
  power_backup: false,
};

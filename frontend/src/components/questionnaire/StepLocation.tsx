"use client";

import { useState, useEffect } from "react";
import type { StepProps, StateInfo, CityInfo } from "@/lib/types";
import { ZONE_TYPES } from "@/lib/constants";
import { fetchStates, fetchCities } from "@/lib/api";

/**
 * Step 2: Location Selection
 * Cascading: State → City → Zone type
 * Falls back to hardcoded data if API is unreachable.
 */
export default function StepLocation({ formData, updateField }: StepProps) {
  const [states, setStates] = useState<StateInfo[]>([]);
  const [cities, setCities] = useState<CityInfo[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  // Fetch states on mount
  useEffect(() => {
    fetchStates()
      .then(setStates)
      .catch(() => {
        // Fallback: provide common states if API is down
        setStates([
          { name: "Maharashtra", city_count: 9 },
          { name: "Delhi", city_count: 2 },
          { name: "Karnataka", city_count: 5 },
          { name: "Tamil Nadu", city_count: 5 },
          { name: "Telangana", city_count: 3 },
          { name: "Uttar Pradesh", city_count: 9 },
          { name: "Haryana", city_count: 5 },
          { name: "Gujarat", city_count: 5 },
          { name: "Rajasthan", city_count: 5 },
          { name: "West Bengal", city_count: 5 },
          { name: "Kerala", city_count: 4 },
          { name: "Punjab", city_count: 5 },
          { name: "Madhya Pradesh", city_count: 4 },
          { name: "Bihar", city_count: 3 },
          { name: "Andhra Pradesh", city_count: 4 },
          { name: "Jharkhand", city_count: 3 },
          { name: "Odisha", city_count: 3 },
          { name: "Goa", city_count: 3 },
          { name: "Uttarakhand", city_count: 3 },
          { name: "Assam", city_count: 2 },
          { name: "Chhattisgarh", city_count: 3 },
          { name: "Himachal Pradesh", city_count: 3 },
          { name: "Jammu and Kashmir", city_count: 2 },
        ]);
      })
      .finally(() => setLoadingStates(false));
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    if (!formData.state) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    fetchCities(formData.state)
      .then(setCities)
      .catch(() => setCities([]))
      .finally(() => setLoadingCities(false));
  }, [formData.state]);

  const handleStateChange = (state: string) => {
    updateField("state", state);
    updateField("city", "");
    updateField("zone", "");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800">Where is the property?</h2>
      <p className="mt-1 text-sm text-slate-500">Select state and city. Zone helps improve accuracy.</p>

      <div className="mt-8 space-y-6">
        {/* State */}
        <div>
          <label htmlFor="state-select" className="block text-sm font-medium text-navy-700 mb-1.5">
            State <span className="text-red-500">*</span>
          </label>
          <select
            id="state-select"
            value={formData.state}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="">Select state...</option>
            {loadingStates ? (
              <option disabled>Loading...</option>
            ) : (
              states.map((s) => (
                <option key={s.name} value={s.name}>{s.name} ({s.city_count} cities)</option>
              ))
            )}
          </select>
        </div>

        {/* City */}
        <div>
          <label htmlFor="city-select" className="block text-sm font-medium text-navy-700 mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <select
            id="city-select"
            value={formData.city}
            onChange={(e) => updateField("city", e.target.value)}
            disabled={!formData.state}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50"
          >
            <option value="">Select city...</option>
            {loadingCities ? (
              <option disabled>Loading cities...</option>
            ) : (
              cities.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))
            )}
          </select>
        </div>

        {/* Zone */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-3">
            Zone / Locality Type <span className="text-slate-400">(optional)</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {ZONE_TYPES.map((z) => (
              <button
                key={z.value}
                type="button"
                onClick={() => updateField("zone", formData.zone === z.value ? "" : z.value)}
                className={`selection-card text-left py-3 ${formData.zone === z.value ? "selected" : ""}`}
              >
                <div className="text-sm font-semibold text-navy-800">{z.label}</div>
                <div className="mt-0.5 text-xs text-slate-500">{z.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

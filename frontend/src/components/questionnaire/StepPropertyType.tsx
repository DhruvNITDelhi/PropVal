"use client";

import { PROPERTY_TYPES } from "@/lib/constants";
import type { StepProps } from "@/lib/types";

/**
 * Step 1: Property Type Selection
 * Large visual cards for each property type — single tap to select.
 */
export default function StepPropertyType({ formData, updateField }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800">What type of property?</h2>
      <p className="mt-1 text-sm text-slate-500">Select the category that best describes your property.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PROPERTY_TYPES.map((pt) => (
          <button
            key={pt.value}
            type="button"
            onClick={() => updateField("property_type", pt.value)}
            className={`selection-card flex items-start gap-4 text-left ${
              formData.property_type === pt.value ? "selected" : ""
            }`}
          >
            <span className="text-3xl">{pt.icon}</span>
            <div>
              <div className="font-semibold text-navy-800">{pt.label}</div>
              <div className="mt-0.5 text-xs text-slate-500">{pt.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

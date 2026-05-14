"use client";

import type { StepProps } from "@/lib/types";
import { QUALITY_OPTIONS, FURNISHING_OPTIONS } from "@/lib/constants";

/**
 * Step 5: Property Condition
 * Age slider, construction quality, and furnishing status.
 */
export default function StepCondition({ formData, updateField }: StepProps) {
  const isLand = formData.property_type === "land";

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800">Property condition</h2>
      <p className="mt-1 text-sm text-slate-500">
        {isLand ? "Age doesn't apply to land. Select quality if developed." : "Helps estimate depreciation and premium."}
      </p>

      <div className="mt-8 space-y-8">
        {/* Age */}
        {!isLand && (
          <div>
            <label htmlFor="age-slider" className="block text-sm font-medium text-navy-700 mb-1.5">
              Property Age: <span className="font-bold text-brand-600">{formData.age_years || 0} years</span>
            </label>
            <input
              id="age-slider"
              type="range"
              min="0"
              max="50"
              value={formData.age_years || 0}
              onChange={(e) => updateField("age_years", Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>New</span>
              <span>10yr</span>
              <span>20yr</span>
              <span>30yr</span>
              <span>40yr</span>
              <span>50yr</span>
            </div>
          </div>
        )}

        {/* Construction Quality */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-3">Construction Quality</label>
          <div className="grid grid-cols-3 gap-3">
            {QUALITY_OPTIONS.map((q) => (
              <button
                key={q.value}
                type="button"
                onClick={() => updateField("construction_quality", formData.construction_quality === q.value ? "" : q.value)}
                className={`selection-card text-center py-4 ${formData.construction_quality === q.value ? "selected" : ""}`}
              >
                <div className="text-sm font-semibold text-navy-800">{q.label}</div>
                <div className="mt-1 text-xs text-slate-500">{q.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Furnishing */}
        {!isLand && (
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-3">Furnishing Status</label>
            <div className="grid grid-cols-3 gap-3">
              {FURNISHING_OPTIONS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => updateField("furnishing", formData.furnishing === f.value ? "" : f.value)}
                  className={`selection-card text-center py-4 ${formData.furnishing === f.value ? "selected" : ""}`}
                >
                  <div className="text-sm font-semibold text-navy-800">{f.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

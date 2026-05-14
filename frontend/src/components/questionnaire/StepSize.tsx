"use client";

import type { StepProps } from "@/lib/types";

/**
 * Step 3: Property Size
 * Carpet area is required. Built-up and plot area are optional.
 */
export default function StepSize({ formData, updateField }: StepProps) {
  const showPlotArea = formData.property_type === "land" || formData.property_type === "house";

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800">What&apos;s the size?</h2>
      <p className="mt-1 text-sm text-slate-500">Enter area in square feet. Only carpet area is required.</p>

      <div className="mt-8 space-y-6">
        {/* Carpet Area */}
        <div>
          <label htmlFor="carpet-area" className="block text-sm font-medium text-navy-700 mb-1.5">
            Carpet Area (sq.ft) <span className="text-red-500">*</span>
          </label>
          <input
            id="carpet-area"
            type="number"
            min="1"
            placeholder="e.g. 850"
            value={formData.carpet_area_sqft}
            onChange={(e) => updateField("carpet_area_sqft", e.target.value ? Number(e.target.value) : "")}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
          <p className="mt-1 text-xs text-slate-400">The actual usable floor area (RERA definition)</p>
        </div>

        {/* Built-up Area */}
        {formData.property_type !== "land" && (
          <div>
            <label htmlFor="buildup-area" className="block text-sm font-medium text-navy-700 mb-1.5">
              Built-up Area (sq.ft) <span className="text-slate-400">(optional)</span>
            </label>
            <input
              id="buildup-area"
              type="number"
              min="1"
              placeholder="e.g. 1050"
              value={formData.buildup_area_sqft}
              onChange={(e) => updateField("buildup_area_sqft", e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        )}

        {/* Plot Area */}
        {showPlotArea && (
          <div>
            <label htmlFor="plot-area" className="block text-sm font-medium text-navy-700 mb-1.5">
              Plot Area (sq.ft) <span className="text-slate-400">(optional)</span>
            </label>
            <input
              id="plot-area"
              type="number"
              min="1"
              placeholder="e.g. 2400"
              value={formData.plot_area_sqft}
              onChange={(e) => updateField("plot_area_sqft", e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        )}
      </div>
    </div>
  );
}

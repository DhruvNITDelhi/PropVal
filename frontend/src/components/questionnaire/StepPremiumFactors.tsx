"use client";

import type { StepProps, FormData } from "@/lib/types";
import { PREMIUM_FACTORS } from "@/lib/constants";

/**
 * Step 6: Premium Factors
 * Toggle chips for boolean features that add value.
 * All optional — users can skip this step entirely.
 */
export default function StepPremiumFactors({ formData, updateField }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800">Premium features</h2>
      <p className="mt-1 text-sm text-slate-500">
        Tap to select any that apply. These add value to your property.
        <span className="text-slate-400"> All optional.</span>
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        {PREMIUM_FACTORS.map((pf) => {
          const isActive = formData[pf.key as keyof FormData] as boolean;
          return (
            <button
              key={pf.key}
              type="button"
              onClick={() => updateField(pf.key as keyof FormData, !isActive as never)}
              className={`toggle-chip ${isActive ? "active" : ""}`}
            >
              <span>{pf.icon}</span>
              <span>{pf.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-10 rounded-xl bg-brand-50 border border-brand-200 p-4">
        <p className="text-sm text-brand-800 font-medium">
          ✨ You&apos;re all set! Click &quot;Get Estimate&quot; below to see your property valuation.
        </p>
      </div>
    </div>
  );
}

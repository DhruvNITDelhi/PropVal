"use client";

import type { StepProps } from "@/lib/types";
import { BHK_OPTIONS } from "@/lib/constants";

/**
 * Step 4: Core Details (dynamic based on property type)
 * Shows BHK, floors, washrooms, parking — only relevant fields.
 */
export default function StepCoreDetails({ formData, updateField }: StepProps) {
  const isApt = formData.property_type === "apartment";
  const isHouse = formData.property_type === "house";
  const isCommercial = formData.property_type === "commercial";
  const isLand = formData.property_type === "land";

  if (isLand) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-navy-800">Any additional details?</h2>
        <p className="mt-1 text-sm text-slate-500">Land parcels don&apos;t need structural details. Feel free to skip ahead.</p>
        <div className="mt-8 rounded-xl bg-slate-50 p-6 text-center text-slate-500">
          <span className="text-4xl">🏗️</span>
          <p className="mt-3 text-sm">No structural details needed for land/plots.</p>
          <p className="text-xs text-slate-400 mt-1">Click Next to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-navy-800">Property details</h2>
      <p className="mt-1 text-sm text-slate-500">All fields optional — but they improve accuracy.</p>

      <div className="mt-8 space-y-6">
        {/* BHK (apartments and houses) */}
        {(isApt || isHouse) && (
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-3">BHK</label>
            <div className="flex gap-3">
              {BHK_OPTIONS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => updateField("bhk", formData.bhk === b ? "" : b)}
                  className={`selection-card flex-1 text-center py-3 ${formData.bhk === b ? "selected" : ""}`}
                >
                  <div className="text-lg font-bold text-navy-800">{b}</div>
                  <div className="text-xs text-slate-500">BHK</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Floor (apartments and commercial) */}
        {(isApt || isCommercial) && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="floor-input" className="block text-sm font-medium text-navy-700 mb-1.5">Floor Number</label>
              <input
                id="floor-input"
                type="number"
                min="0"
                placeholder="e.g. 7"
                value={formData.floor}
                onChange={(e) => updateField("floor", e.target.value ? Number(e.target.value) : "")}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label htmlFor="total-floors" className="block text-sm font-medium text-navy-700 mb-1.5">Total Floors</label>
              <input
                id="total-floors"
                type="number"
                min="1"
                placeholder="e.g. 14"
                value={formData.total_floors}
                onChange={(e) => updateField("total_floors", e.target.value ? Number(e.target.value) : "")}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
        )}

        {/* Floors for house */}
        {isHouse && (
          <div>
            <label htmlFor="total-floors-house" className="block text-sm font-medium text-navy-700 mb-1.5">Number of Floors</label>
            <input
              id="total-floors-house"
              type="number"
              min="1"
              max="5"
              placeholder="e.g. 2"
              value={formData.total_floors}
              onChange={(e) => updateField("total_floors", e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        )}

        {/* Washrooms + Parking */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="washrooms" className="block text-sm font-medium text-navy-700 mb-1.5">Washrooms</label>
            <input
              id="washrooms"
              type="number"
              min="1"
              max="10"
              placeholder="e.g. 2"
              value={formData.washrooms}
              onChange={(e) => updateField("washrooms", e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div>
            <label htmlFor="parking" className="block text-sm font-medium text-navy-700 mb-1.5">Parking Spots</label>
            <input
              id="parking"
              type="number"
              min="0"
              max="5"
              placeholder="e.g. 1"
              value={formData.parking}
              onChange={(e) => updateField("parking", e.target.value ? Number(e.target.value) : "")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

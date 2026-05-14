"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { StepProps } from "@/lib/types";
import { ZONE_TYPES } from "@/lib/constants";

// Dynamically import map to avoid Next.js SSR window errors
const LocationMap = dynamic(() => import("./LocationMap"), { 
  ssr: false, 
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Map...</div> 
});

export default function StepLocation({ formData, updateField }: StepProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleLocationSelect = async (lat: number, lng: number) => {
    updateField("lat", lat);
    updateField("lng", lng);
    
    setIsLocating(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`);
      if (res.ok) {
        const data = await res.json();
        const address = data.address;
        
        // Try to extract city and state
        const city = address.city || address.town || address.village || address.state_district || address.county || "";
        const state = address.state || "";
        const pincode = address.postcode || "";
        
        updateField("city", city);
        updateField("state", state);
        updateField("pincode", pincode);
      }
    } catch (err) {
      console.error("Failed to reverse geocode:", err);
    } finally {
      setIsLocating(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const result = data[0];
          handleLocationSelect(parseFloat(result.lat), parseFloat(result.lon));
        } else {
          alert("Location not found. Please try a different query.");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => handleLocationSelect(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-bold text-navy-800">Where is the property?</h2>
      <p className="mt-1 text-sm text-slate-500">
        Search for an address, use your GPS, or drop a pin directly on the map.
      </p>

      {/* Search Bar */}
      <div className="mt-4 flex flex-col sm:flex-row gap-2 relative z-10">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, area, or society..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-navy-800 text-white rounded-lg text-sm font-medium hover:bg-navy-700 disabled:opacity-50"
          >
            {isSearching ? "..." : "Search"}
          </button>
        </form>
        <button
          type="button"
          onClick={handleGeolocation}
          className="px-4 py-2 bg-brand-50 border border-brand-200 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-100 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> Locate Me
        </button>
      </div>

      {/* Map Section */}
      <div className="mt-4 h-[250px] sm:h-[300px] w-full relative z-0">
        <LocationMap initialLat={formData.lat} initialLng={formData.lng} onLocationSelect={handleLocationSelect} />
      </div>

      {/* Location Details */}
      {(formData.city || isLocating) && (
        <div className="mt-4 p-4 rounded-xl bg-brand-50 border border-brand-100 flex items-center gap-3">
          <div className="text-2xl">📍</div>
          <div>
            {isLocating ? (
              <div className="text-sm text-brand-800 font-medium">Detecting area...</div>
            ) : (
              <>
                <div className="text-sm font-bold text-brand-900">{formData.city}, {formData.state}</div>
                {formData.pincode && <div className="text-xs text-brand-700">Pincode: {formData.pincode}</div>}
              </>
            )}
          </div>
        </div>
      )}

      {/* Zone Selection (Still needed for pricing baseline) */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-navy-700 mb-3">
          Zone Type <span className="text-slate-400">(optional, helps accuracy)</span>
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
  );
}

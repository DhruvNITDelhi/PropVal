"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ValuationResult } from "@/lib/types";

/** Format number to Indian currency notation (Lakh/Crore). */
function formatINR(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

/**
 * ResultsDisplay
 * Shows the full valuation result: price range, confidence, breakdown, and comparison.
 */
export default function ResultsDisplay({
  result,
  onNewValuation,
}: {
  result: ValuationResult;
  onNewValuation: () => void;
}) {
  const [animatedPrice, setAnimatedPrice] = useState(0);

  // Counting animation for the fair estimate
  useEffect(() => {
    const target = result.fair_estimate;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, target);
      setAnimatedPrice(Math.round(current));
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result.fair_estimate]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* ─── Price Hero ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl bg-gradient-to-br from-navy-800 to-navy-900 p-8 text-center text-white shadow-xl"
      >
        <p className="text-sm font-medium text-brand-300 uppercase tracking-wider">
          Estimated {result.property_type_label} Value
        </p>

        {/* Price range */}
        <div className="mt-6 flex items-end justify-center gap-4">
          <div className="text-right">
            <p className="text-xs text-slate-400">Lower</p>
            <p className="text-lg font-semibold text-slate-300">{formatINR(result.lower_estimate)}</p>
          </div>
          <div>
            <p className="text-xs text-brand-300 font-medium">Fair Estimate</p>
            <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              {formatINR(animatedPrice)}
            </p>
          </div>
          <div className="text-left">
            <p className="text-xs text-slate-400">Upper</p>
            <p className="text-lg font-semibold text-slate-300">{formatINR(result.upper_estimate)}</p>
          </div>
        </div>

        {/* Per sqft rate */}
        <p className="mt-4 text-sm text-slate-400">
          ₹{result.per_sqft_rate.toLocaleString("en-IN")}/sq.ft
          <span className="mx-2">•</span>
          City avg: ₹{result.city_average_psf.toLocaleString("en-IN")}/sq.ft
        </p>

        {/* Confidence meter */}
        <div className="mt-6">
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="text-slate-400">Confidence:</span>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-32 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    result.confidence_pct >= 70
                      ? "bg-green-400"
                      : result.confidence_pct >= 50
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${result.confidence_pct}%` }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </div>
              <span className="font-bold text-white">{result.confidence_pct}%</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                result.confidence_label === "High" ? "bg-green-500/20 text-green-300" :
                result.confidence_label === "Medium" ? "bg-yellow-500/20 text-yellow-300" :
                "bg-red-500/20 text-red-300"
              }`}>{result.confidence_label}</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Market Volatility: {result.market_volatility}
          </p>
        </div>
      </motion.div>

      {/* ─── Why This Estimate? ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm"
      >
        <h3 className="text-lg font-bold text-navy-800">Why This Estimate?</h3>
        <p className="mt-1 text-xs text-slate-500">
          Every factor that influenced your property&apos;s valuation:
        </p>

        <div className="mt-5 space-y-3">
          {result.factors_applied.map((factor, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
              className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span className={`text-sm ${
                  factor.direction === "positive" ? "text-green-600" :
                  factor.direction === "negative" ? "text-red-500" :
                  "text-slate-600"
                }`}>
                  {factor.direction === "positive" ? "✅" :
                   factor.direction === "negative" ? "❌" : "📋"}
                </span>
                <span className="text-sm text-navy-700">{factor.name}</span>
              </div>
              <div className="text-right">
                {factor.value && (
                  <span className="text-sm font-semibold text-navy-800">{factor.value}</span>
                )}
                {factor.impact_pct != null && (
                  <span className={`text-sm font-bold ml-2 ${
                    factor.direction === "positive" ? "text-green-600" : "text-red-500"
                  }`}>
                    {factor.impact_pct > 0 ? "+" : ""}{factor.impact_pct}%
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Disclaimer ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-6 rounded-xl bg-amber-50 border border-amber-200 p-4"
      >
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Disclaimer:</strong> {result.data_quality_note}
        </p>
      </motion.div>

      {/* ─── Actions ─────────────────────────────────────────────── */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onNewValuation}
          className="btn-gradient rounded-xl px-8 py-3 text-sm font-bold"
        >
          New Valuation →
        </button>
      </div>
    </div>
  );
}

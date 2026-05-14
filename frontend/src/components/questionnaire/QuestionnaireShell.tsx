"use client";

import { motion, AnimatePresence } from "framer-motion";
import { STEP_TITLES, TOTAL_STEPS } from "@/lib/constants";
import type { FormData } from "@/lib/types";
import StepPropertyType from "./StepPropertyType";
import StepLocation from "./StepLocation";
import StepSize from "./StepSize";
import StepCoreDetails from "./StepCoreDetails";
import StepCondition from "./StepCondition";
import StepPremiumFactors from "./StepPremiumFactors";

interface QuestionnaireShellProps {
  currentStep: number;
  formData: FormData;
  updateField: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  isStepValid: () => boolean;
  isLastStep: boolean;
  isLoading: boolean;
  onSubmit: () => void;
}

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

/**
 * QuestionnaireShell
 * Wraps all 6 steps with progress bar, navigation, and Framer Motion transitions.
 */
export default function QuestionnaireShell({
  currentStep,
  formData,
  updateField,
  nextStep,
  prevStep,
  isStepValid,
  isLastStep,
  isLoading,
  onSubmit,
}: QuestionnaireShellProps) {
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const renderStep = () => {
    const props = { formData, updateField };
    switch (currentStep) {
      case 0: return <StepPropertyType {...props} />;
      case 1: return <StepLocation {...props} />;
      case 2: return <StepSize {...props} />;
      case 3: return <StepCoreDetails {...props} />;
      case 4: return <StepCondition {...props} />;
      case 5: return <StepPremiumFactors {...props} />;
      default: return null;
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* ─── Progress Bar ──────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
            Step {currentStep + 1} of {TOTAL_STEPS}
          </span>
          <span className="text-xs text-slate-500">
            {STEP_TITLES[currentStep]}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
        {/* Step pills */}
        <div className="mt-3 flex gap-1">
          {STEP_TITLES.map((title, i) => (
            <div
              key={title}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= currentStep ? "bg-brand-500" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ─── Step Content ──────────────────────────────────────────── */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm min-h-[360px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ─── Navigation ────────────────────────────────────────────── */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="rounded-lg border border-slate-300 px-6 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Back
        </button>

        {isLastStep ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!isStepValid() || isLoading}
            className="btn-gradient rounded-lg px-8 py-2.5 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Calculating...
              </>
            ) : (
              "Get Estimate →"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={nextStep}
            disabled={!isStepValid()}
            className="btn-gradient rounded-lg px-8 py-2.5 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

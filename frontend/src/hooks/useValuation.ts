"use client";

/**
 * useValuation Hook
 *
 * Manages the entire questionnaire + valuation flow:
 * - Form state across all 6 steps
 * - Step navigation (next/prev)
 * - Submission to backend
 * - Loading and error states
 * - Result storage
 */

import { useState, useCallback } from "react";
import type { FormData, ValuationResult } from "@/lib/types";
import { INITIAL_FORM_DATA, TOTAL_STEPS } from "@/lib/constants";
import { submitValuation } from "@/lib/api";

export function useValuation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({ ...INITIAL_FORM_DATA });
  const [result, setResult] = useState<ValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Update a single form field. */
  const updateField = useCallback(
    <K extends keyof FormData>(key: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  /** Navigate to next step. */
  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
  }, []);

  /** Navigate to previous step. */
  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  /** Go to a specific step. */
  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, TOTAL_STEPS - 1)));
  }, []);

  /** Submit the form to the backend for valuation. */
  const submit = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await submitValuation(formData);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  /** Reset everything for a new valuation. */
  const reset = useCallback(() => {
    setCurrentStep(0);
    setFormData({ ...INITIAL_FORM_DATA });
    setResult(null);
    setError(null);
  }, []);

  /** Check if the current step has required fields filled. */
  const isStepValid = useCallback((): boolean => {
    switch (currentStep) {
      case 0:
        return formData.property_type !== "";
      case 1:
        return formData.state !== "" && formData.city !== "";
      case 2:
        return formData.carpet_area_sqft !== "" && Number(formData.carpet_area_sqft) > 0;
      case 3:
      case 4:
      case 5:
        return true; // Optional steps
      default:
        return true;
    }
  }, [currentStep, formData]);

  return {
    currentStep,
    formData,
    result,
    isLoading,
    error,
    updateField,
    nextStep,
    prevStep,
    goToStep,
    submit,
    reset,
    isStepValid,
    isLastStep: currentStep === TOTAL_STEPS - 1,
  };
}

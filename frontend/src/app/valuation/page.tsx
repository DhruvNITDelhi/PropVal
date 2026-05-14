"use client";

import { useValuation } from "@/hooks/useValuation";
import QuestionnaireShell from "@/components/questionnaire/QuestionnaireShell";
import ResultsDisplay from "@/components/results/ResultsDisplay";

/**
 * Valuation Page
 * Routes between the questionnaire form and results display.
 */
export default function ValuationPage() {
  const {
    currentStep,
    formData,
    result,
    isLoading,
    error,
    updateField,
    nextStep,
    prevStep,
    submit,
    reset,
    isStepValid,
    isLastStep,
  } = useValuation();

  // Show results if we have them
  if (result) {
    return <ResultsDisplay result={result} onNewValuation={reset} />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Error banner */}
      {error && (
        <div className="mx-auto max-w-2xl px-4 pt-6">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-700">
              <strong>Error:</strong> {error}
            </p>
            <p className="mt-1 text-xs text-red-500">
              Make sure the backend is running on http://localhost:8000
            </p>
          </div>
        </div>
      )}

      <QuestionnaireShell
        currentStep={currentStep}
        formData={formData}
        updateField={updateField}
        nextStep={nextStep}
        prevStep={prevStep}
        isStepValid={isStepValid}
        isLastStep={isLastStep}
        isLoading={isLoading}
        onSubmit={submit}
      />
    </div>
  );
}

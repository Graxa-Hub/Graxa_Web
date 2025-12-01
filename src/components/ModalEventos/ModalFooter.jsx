import React from "react";

export function ModalFooter({
  showNavigation = true,
  showFooter = true,
  currentStep,
  totalSteps,
  nextButtonText = "Próxima Etapa",
  beforeButtonText = "Voltar",
  onNext,
  onPrevious,
}) {
  if (!showNavigation || !showFooter) return null;

  return (
    <div className="flex justify-center items-center gap-4 px-16 py-6 border-t border-gray-200">
      {currentStep > 1 && (
        <button
          onClick={onPrevious}
          className="px-8 py-3 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition-colors"
        >
          {beforeButtonText}
        </button>
      )}
      <button
        onClick={onNext}
        className="px-8 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
      >
        {currentStep === totalSteps ? "Finalizar" : nextButtonText}
      </button>
    </div>
  );
}

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
    <div className="modal-footer">
      {currentStep > 1 && (
        <button onClick={onPrevious} className="modal-btn-secondary">
          {beforeButtonText}
        </button>
      )}
      <button onClick={onNext} className="modal-btn-primary">
        {currentStep === totalSteps ? "Finalizar" : nextButtonText}
      </button>
    </div>
  );
}

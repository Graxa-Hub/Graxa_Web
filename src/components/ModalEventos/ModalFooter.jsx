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
  loading = false,
}) {
  if (!showNavigation || !showFooter) return null;

  return (
    <div className="modal-footer">
      {currentStep > 1 && (
        <button 
          onClick={onPrevious} 
          className="modal-btn-secondary"
          disabled={loading}
        >
          {beforeButtonText}
        </button>
      )}
      <button 
        onClick={onNext} 
        className="modal-btn-primary"
        disabled={loading}
      >
        {loading ? "Processando..." : (currentStep === totalSteps ? "Finalizar" : nextButtonText)}
      </button>
    </div>
  );
}

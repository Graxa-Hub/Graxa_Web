import React, { useState, useEffect } from "react";
import { ModalHeader } from "./ModalHeader";
import { ModalContent } from "./ModalContent";
import { ModalFooter } from "./ModalFooter";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  totalSteps = 1,
  nextButtonText = "Próxima Etapa",
  beforeButtonText = "Voltar",
  showNavigation = true,
  showFooter = true,
  size = "md",
  onFinish,
}) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (isOpen) setCurrentStep(1);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    else if (onFinish) onFinish();
    else onClose();
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50 p-4" onClick={handleOverlayClick}>
      <div className={`modal-panel relative overflow-hidden ${size === "lg" ? "max-w-[920px]" : "max-w-[780px]"}`}>
        <ModalHeader
          title={title}
          currentStep={currentStep}
          totalSteps={totalSteps}
          showNavigation={showNavigation}
          onClose={handleClose}
        />
        <ModalContent currentStep={currentStep}>{children}</ModalContent>
        <ModalFooter
          showNavigation={showNavigation}
          showFooter={showFooter}
          currentStep={currentStep}
          totalSteps={totalSteps}
          nextButtonText={nextButtonText}
          beforeButtonText={beforeButtonText}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>
    </div>
  );
}

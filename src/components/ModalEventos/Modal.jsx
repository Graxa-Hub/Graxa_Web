import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      if (onFinish) {
        onFinish();
      } else {
        onClose();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  return (
    // Background para dar aspecto escuro no fundo
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      {/* Modal Box */}
      <div className={`bg-white rounded-md shadow-lg min-h-80 h-fit relative overflow-hidden ${size === "lg" ? "w-[780px]" : "w-[700px]"
        } max-w-[95vw]`}>
        {/* Header */}
        <ModalHeader
          title={title}
          currentStep={currentStep}
          totalSteps={totalSteps}
          showNavigation={showNavigation}
          onClose={handleClose}
        />

        {/* Content */}
        <ModalContent currentStep={currentStep}>{children}</ModalContent>

        {/* Footer com botão centrado */}
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

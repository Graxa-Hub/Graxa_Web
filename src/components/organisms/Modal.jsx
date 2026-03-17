import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { ModalHeader } from "../ModalEventos/ModalHeader";
import { ModalContent } from "../ModalEventos/ModalContent";
import { ModalFooter } from "../ModalEventos/ModalFooter";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  totalSteps = 1,
  nextButtonText = "Próxima Etapa",
  beforeButtonText = "Voltar",
  showNavigation = true,
  showFooter = true, // ✅ nova prop
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
      className="fixed inset-0 flex items-center justify-center z-50 bg-[var(--overlay)] backdrop-blur-[2px]"
      onClick={handleOverlayClick}
    >
      {/* Modal Box */}
      <div className="bg-[var(--surface-elevated)] border border-[var(--border)] rounded-[var(--radius-md)] min-h-80 h-fit relative p-5 w-full max-w-300 shadow-[var(--shadow-card)]">
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

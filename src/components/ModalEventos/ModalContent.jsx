import React from "react";

export function ModalContent({ children, currentStep }) {
  return (
    <div className="modal-body max-h-[calc(90vh-160px)]">
      {typeof children === "function" ? children(currentStep) : children}
    </div>
  );
}

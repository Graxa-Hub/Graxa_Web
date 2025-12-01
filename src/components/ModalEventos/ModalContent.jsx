import React from "react";

export function ModalContent({ children, currentStep }) {
  return (
    <div className="px-10 py-3 overflow-y-auto max-h-[calc(90vh-200px)]">
      {typeof children === "function" ? children(currentStep) : children}
    </div>
  );
}

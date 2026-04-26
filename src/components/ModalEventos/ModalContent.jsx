import React from "react";

export function ModalContent({ children, currentStep, globalError }) {
  return (
    <div className="modal-body max-h-[calc(90vh-160px)]">
      {globalError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {globalError}
        </div>
      )}
      {typeof children === "function" ? children(currentStep) : children}
    </div>
  );
}

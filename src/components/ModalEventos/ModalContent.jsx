import React from "react";
import { AlertCircle } from "lucide-react";

export function ModalContent({ children, currentStep, globalError }) {
  return (
    <div className="modal-body max-h-[calc(90vh-160px)] overflow-y-auto overflow-x-visible">
      {globalError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-900 mb-1">Ocorreu um erro</p>
            <p className="text-sm text-red-700 leading-relaxed">{globalError}</p>
          </div>
        </div>
      )}
      {typeof children === "function" ? children(currentStep) : children}
    </div>
  );
}

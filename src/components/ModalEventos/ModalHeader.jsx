import React from "react";
import { X } from "lucide-react";

export function ModalHeader({
  title,
  currentStep,
  totalSteps,
  showNavigation = true,
  onClose,
}) {
  return (
    <div className="modal-header">
      <div className="flex flex-col gap-3 flex-1">
        <h2 className="text-base font-semibold text-[var(--text-primary)]">{title}</h2>
        {showNavigation && totalSteps > 1 && (
          <div className="flex items-center gap-2">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index + 1 === currentStep ? "bg-[var(--accent)]" : "bg-[var(--border)]"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="h-8 w-8 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

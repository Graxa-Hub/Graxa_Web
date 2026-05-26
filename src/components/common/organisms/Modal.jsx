import React from "react";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-[var(--overlay)] backdrop-blur-[2px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-panel">
        <div className="modal-header">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[var(--surface-hover)] rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

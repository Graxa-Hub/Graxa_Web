import React from "react";
export const Input = ({ label, required, error, className = "", ...props }) => (
    <div className={`flex flex-col gap-1.5 ${className}`}>
        {label && <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">{label}{required && <span className="text-[var(--accent)] ml-1">*</span>}</label>}
        <input className={`form-input ${error ? "border-[var(--accent)]" : ""}`} {...props} />
        {error && <p className="text-xs text-[var(--accent)]">{error}</p>}
    </div>
);

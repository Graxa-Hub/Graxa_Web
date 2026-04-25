import React from "react";
export const Select = ({ children, value, onChange, name, disabled, className = "" }) => (
    <select value={value} onChange={onChange} name={name} disabled={disabled} className={`form-input ${className}`}>
        <option value="">Selecione...</option>{children}
    </select>
);

import React from "react";

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  rows = 4,
  maxLength,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
          {label}
          {required && <span className="text-[var(--accent)] ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className="form-input min-h-[100px] resize-y"
        {...props}
      />
      {maxLength && (
        <div className="text-xs text-[var(--text-muted)] text-right">
          {value?.length || 0}/{maxLength}
        </div>
      )}
    </div>
  );
}

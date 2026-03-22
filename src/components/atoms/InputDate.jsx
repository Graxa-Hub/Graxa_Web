import React from 'react';

export function InputDate({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-xs uppercase tracking-wide text-[var(--text-muted)] mb-2">
          {label} {required && <span className="text-[var(--accent)]">*</span>}
        </label>
      )}
      <input
        type="datetime-local"
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-input ${error ? 'border-[var(--accent)]' : ''} ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-[var(--accent)]">{error}</p>
      )}
    </div>
  );
}

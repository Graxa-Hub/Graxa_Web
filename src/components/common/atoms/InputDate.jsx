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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="datetime-local"
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-lg outline-none transition-all
          ${error 
            ? 'border-red-500 focus:ring-2 focus:ring-red-200' 
            : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          hover:border-gray-400
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
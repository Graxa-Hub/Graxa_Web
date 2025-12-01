import React from "react";

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
  ...props
}) {
  return (
    <div>
      <div className={`flex flex-col ${className}`}>
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="px-4 py-2 border border-gray-200 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 bg-white"
          {...props}
        />
      </div>
    </div>
  );
}

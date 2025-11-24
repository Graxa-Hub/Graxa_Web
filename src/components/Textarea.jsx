import React from 'react'

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
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        maxLength={maxLength}
        className="px-4 py-3 border border-gray-200 rounded-lg shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 bg-white resize-none"
        {...props}
      />
      {maxLength && (
        <div className="text-xs text-gray-500 text-right">
          {value?.length || 0}/{maxLength}
        </div>
      )}
    </div>
  )
}
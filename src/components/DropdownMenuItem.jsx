import React from 'react'

export function DropdownMenuItem({ icon: Icon, label, onClick, className = "" }) {
  return (
    <button
      onClick={(e) => onClick(e)}
      className={`w-full cursor-pointer flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 ${className}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  )
}
import React from 'react'
import { DropdownMenuItem } from './DropdownMenuItem'

export function DropdownMenu({ isOpen, items, className = "" }) {
  if (!isOpen) return null

  return (
    <div className={` cursor-pointer absolute right-0 gap-3 bg-white border border-gray-300 flex flex-col justify-center items-center rounded-lg shadow-lg py-1 min-w-50 min-h-25 shadow-2xl z-10 ${className}`}>
      {items.map((item, index) => (
        <DropdownMenuItem
          key={index}
          icon={item.icon}
          label={item.label}
          onClick={item.onClick}
        />
      ))}
    </div>
  )
}
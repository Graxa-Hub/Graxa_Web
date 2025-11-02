import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function BandaDropdown({ bands, selectedBand, onBandSelect }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleBandSelect = (band) => {
    onBandSelect(band)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50"
      >
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="font-medium">{selectedBand}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px] z-10">
          {bands.map((band) => (
            <button
              key={band}
              onClick={() => handleBandSelect(band)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            >
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              {band}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
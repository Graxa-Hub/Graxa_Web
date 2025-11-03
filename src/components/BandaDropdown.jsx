import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function BandaDropdown({ bands, selectedBand, onBandSelect }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleBandSelect = (band) => {
    onBandSelect(band)
    setIsOpen(false)
  }

  return (
    <div className="relative bg-white rounded-lg shadow-sm p-4 max-w-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white rounded-lg shadow-sm p-4 max-w-md w-full"
      >
        <div className="flex items-center justify-between w-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
              {selectedBand.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{selectedBand}</div>
              <div className="text-sm text-gray-500">Banda</div>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-full z-10">
          {bands.map((band) => (
            <button
              key={band}
              onClick={() => handleBandSelect(band)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                {band.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-900">{band}</div>
                <div className="text-sm text-gray-500">Banda</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
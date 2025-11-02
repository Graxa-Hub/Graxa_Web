import React from 'react'
import { ChevronDown } from 'lucide-react'
import { ButtonPage } from './ButtonPage.Jsx'
import { BandaDropdown } from './BandaDropdown'

export const TurneHeader = ({ eventName, eventType }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 max-w-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
            {eventName ? eventName.charAt(0) : "?"}
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {eventName || "Evento"}
            </div>
            <div className="text-sm text-gray-500">
              {eventType || "Tipo de evento"}
            </div>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </div>
    </div>
  )
}

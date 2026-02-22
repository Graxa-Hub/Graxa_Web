import React from 'react'
import { AddButton } from './atoms/AddButton'
import { BandaDropdown } from './BandaDropdown'

export function TurneHeader({ selectedBand, onBandSelect, onCreateTurne }) {
  return (
    <header className='flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 w-full bg-white border-b border-gray-200 gap-4 sm:gap-0 sm:pr-20'>
      <BandaDropdown
        selectedBand={selectedBand}
        onBandSelect={onBandSelect}
        showAllOption={true}
      />
      <div className="sm:mr-8">
        <AddButton
          text="Criar uma turnê"
          click={onCreateTurne}
        />
      </div>
    </header>
  )
}
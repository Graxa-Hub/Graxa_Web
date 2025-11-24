import React from 'react'
import { ButtonPage } from './ButtonPage'
import { BandaDropdown } from './BandaDropdown'

export function TurneHeader({ selectedBand, onBandSelect, onCreateTurne }) {
  return (
    <header className='flex justify-between items-center p-6 w-full bg-white border-b border-gray-200'>
      <BandaDropdown 
        selectedBand={selectedBand}
        onBandSelect={onBandSelect}
        showAllOption={true}
      />
      <ButtonPage 
        text="Criar uma turnê" 
        click={onCreateTurne} 
      />
    </header>
  )
}
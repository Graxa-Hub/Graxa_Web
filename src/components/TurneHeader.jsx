import React from 'react'
import { ButtonPage } from './ButtonPage.Jsx'
import { BandaDropdown } from './BandaDropdown'

export function TurneHeader({ bands, selectedBand, onBandSelect, onCreateTurne }) {
  return (
    <header className='flex justify-between items-center p-6 w-full bg-white border-b border-gray-200'>
      <BandaDropdown 
        bands={bands}
        selectedBand={selectedBand}
        onBandSelect={onBandSelect}
      />
      <ButtonPage 
        text="Criar uma turnê" 
        click={onCreateTurne} 
      />
    </header>
  )
}
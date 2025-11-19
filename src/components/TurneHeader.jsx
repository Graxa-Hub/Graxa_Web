import React from 'react'
import { ButtonPage } from './ButtonPage'
import { DropdownGenerico } from './DropdownGenerico'

export function TurneHeader({ selectedBand, onBandSelect, onCreateTurne, bandas }) {
  return (
    <header className='flex justify-between items-center p-6 w-full bg-white border-b border-gray-200'>

      
        <DropdownGenerico
          options={bandas}
          selected={selectedBand}
          onSelect={onBandSelect}
          getLabel={b => b.nome}
          getImage={b => b.imagemUrl}
          showAllOption={true}
          allLabel="Todas as bandas"
          placeholder="Selecione uma banda"
        />
      
      <ButtonPage 
        text="Criar uma turnê" 
        click={onCreateTurne} 
      />
    </header>
  )
}
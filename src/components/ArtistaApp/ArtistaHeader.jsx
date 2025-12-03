import React from 'react';
import { ButtonPage } from '../ButtonPage';

export function ArtistaHeader({ onAddBanda }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 sm:gap-0">
      <div>
        <h1 className="font-semibold text-lg bg-white inline-block px-4 py-2 rounded shadow">
          Bandas
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Gerencie as bandas e seus integrantes.
        </p>
      </div>
      <div className="sm:mr-8">
        <ButtonPage text="Adicionar banda" click={onAddBanda} />
      </div>
    </div>
  );
}
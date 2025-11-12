import React from "react";

// Menu do dropdown para acionar modais. Sem navegação.
export const Dropdown = ({ open, onOpenArtist, onOpenTour }) => {
  if (!open) return null; // não renderiza quando fechado

  const handleArtist = () => {
    if (onOpenArtist) onOpenArtist();
  };

  const handleTour = () => {
    if (onOpenTour) onOpenTour();
  };

  return (
    <div
      className="absolute top-full mt-2 z-50 translate-x-[-15px]"
      role="menu"
      aria-label="Ações de gerenciamento"
    >
      <div className="w-[280px] bg-white shadow-lg rounded-md px-5 py-3 space-y-4">
        <button
          type="button"
          onClick={handleArtist}
          role="menuitem"
          className="group flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-neutral-300 rounded-sm"
        >
          <h2 className="text-xl font-semibold group-hover:text-neutral-900">
            Alterar Artista
          </h2>
          <p className="text-md text-neutral-500">Gerenciar artista</p>
        </button>
        <button
          type="button"
          onClick={handleTour}
          role="menuitem"
          className="group flex flex-col text-left focus:outline-none focus:ring-2 focus:ring-neutral-300 rounded-sm"
        >
          <h2 className="text-xl font-semibold group-hover:text-neutral-900">
            Alterar Turne
          </h2>
          <p className="text-md text-neutral-500">Gerenciar turnes</p>
        </button>
      </div>
    </div>
  );
};

export default Dropdown;

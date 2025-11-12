import React from "react";

export const Dropdown = ({ open, onOpenArtist, onOpenTour, active }) => {
  if (!open) return null;

  const handleArtist = () => {
    if (onOpenArtist) onOpenArtist();
  };

  const handleTour = () => {
    if (onOpenTour) onOpenTour();
  };

  return (
    <div
      className="absolute top-full mt-2 z-50 translate-x-[-15px] "
      role="menu"
    >
      {/* Area do DropDown */}
      <div className="w-[280px] bg-white shadow-lg rounded-md px-4 py-2 space-y-4">
        {/* Opções do Dropdown */}
        <button
          type="button"
          onClick={handleArtist}
          aria-selected={active === "artist"}
          className={`w-full group flex flex-col text-left focus:outline-none rounded-sm ${
            active === "artist" ? "ring-1 ring-neutral-300 rounded-md" : ""
          }`}
        >
          <h2 className="text-xl font-semibold group-hover:text-neutral-900">
            Alterar Artista
          </h2>
          <p className="text-md text-neutral-500">Gerenciar artista</p>
        </button>

        {/* Opção do Dropdown */}
        <button
          type="button"
          onClick={handleTour}
          aria-selected={active === "tour"}
          className={`w-full group flex flex-col text-left focus:outline-none rounded-sm ${
            active === "tour" ? "ring-1 ring-neutral-300 rounded-md" : ""
          }`}
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

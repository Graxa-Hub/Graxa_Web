import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";

export const Header = ({ titulo = "Boogarins", turne = "bacuri", circulo }) => {
  const [isOpen, setOpen] = useState(false);

  const abrirDropdown = () => setOpen(true);
  const fecharDropdown = () => setOpen(false);
  const alternarDropdown = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && fecharDropdown();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Handlers simples para abrir modais (substitua pelos modais reais)
  const handleOpenArtist = () => {
    setOpen(false);
    console.log("Abrir modal: Artistas registrados");
  };

  const handleOpenTour = () => {
    setOpen(false);
    console.log("Abrir modal: Turnês registradas");
  };

  return (
    <header className="flex h-14 w-full mb-5">
      {/* Area */}
      <div className="relative flex justify-between items-center h-full max-w-70 w-full sm:w-1/3 px-4 bg-white rounded-lg">
        <Dropdown
          open={isOpen}
          onOpenArtist={handleOpenArtist}
          onOpenTour={handleOpenTour}
        />

        <div className="flex gap-3 items-center">
          {/* Bolinha Colorida */}
          <div className={`h-8 w-8 rounded-full ${circulo}`}></div>

          {/* Textos - Informação */}
          <div>
            <h2 className="font-semibold">{titulo}</h2>
            <p className="text-neutral-700 text-sm">TURNE: {turne}</p>
          </div>
        </div>

        <div>
          <ChevronDown className="cursor-pointer" onClick={alternarDropdown} />
        </div>
      </div>
    </header>
  );
};

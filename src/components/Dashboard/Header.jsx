import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { ArtistaModal } from "./ArtistaModal";
import { TurneModal } from "./TurneModal";

export const Header = ({ titulo = "Boogarins", turne = "bacuri", circulo }) => {
  const [isOpen, setOpen] = useState(false);
  const [artistOpen, setArtistOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(null);

  const abrirDropdown = () => setOpen(true);
  const fecharDropdown = () => setOpen(false);
  const alternarDropdown = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && fecharDropdown();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const handleOpenArtist = () => {
    setActiveOption("artist");
    setArtistOpen(true);
  };

  const handleOpenTour = () => {
    setActiveOption("tour");
    setTourOpen(true);
  };

  return (
    <header className="flex h-14 w-full mb-5">
      {/* Area */}
      <div className="relative flex justify-between items-center h-full max-w-70 w-full sm:w-1/3 px-4 bg-white rounded-lg">
        <Dropdown
          open={isOpen}
          active={activeOption}
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
          {isOpen ? (
            <ChevronDown
              className="cursor-pointer"
              onClick={alternarDropdown}
            />
          ) : (
            <ChevronUp className="cursor-pointer" onClick={alternarDropdown} />
          )}
        </div>

        {/* Modais lógicas: renderizam somente quando open = true */}
        <ArtistaModal open={artistOpen} onClose={() => setArtistOpen(false)} />
        <TurneModal open={tourOpen} onClose={() => setTourOpen(false)} />
      </div>
    </header>
  );
};

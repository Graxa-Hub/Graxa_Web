import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { useHeaderLogic } from "../../hooks/useHeaderLogic";
import { ArtistaModal } from "../Dashboard/ArtistaModal";
import { TurneModal } from "../Dashboard/TurneModal";
import { Dropdown } from "../ModalEventos/Dropdown";

export const Header = ({
  circulo,
  bandas,
  turnes,
  bandaSelecionada,
  turneSelecionada,
  onBandaChange,
  onTurneChange,
}) => {
  const {
    isOpen,
    artistOpen,
    tourOpen,
    activeOption,
    turnesDaBanda,
    alternarDropdown,
    setArtistOpen,
    setTourOpen,
    handleOpenArtist,
    handleOpenTour,
    handleBandaSelect,
    handleTurneSelect,
    handleBandaSelectFromModal,
    handleTurneSelectFromModal,
  } = useHeaderLogic({
    bandas,
    turnes,
    bandaSelecionada,
    onBandaChange,
    onTurneChange,
  });

  return (
    <header className="flex justify-between items-center w-full h-14 mb-5">
      <div className="relative flex justify-between items-center h-full max-w-70 sm:w-1/3 px-4 bg-white rounded-lg">
        <Dropdown
          open={isOpen}
          active={activeOption}
          bandas={bandas}
          turnes={turnesDaBanda}
          bandaSelecionada={bandaSelecionada}
          turneSelecionada={turneSelecionada}
          onOpenArtist={handleOpenArtist}
          onOpenTour={handleOpenTour}
          onBandaSelect={handleBandaSelect}
          onTurneSelect={handleTurneSelect}
        />

        <div className="flex gap-3 items-center">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-green-500">
            {turneSelecionada?.imagemUrl ? (
              <img
                src={turneSelecionada.imagemUrl}
                alt={turneSelecionada.nomeTurne || turneSelecionada.nome}
                className="object-cover w-full h-full"
              />
            ) : bandaSelecionada?.imagemUrl ? (
              <img
                src={bandaSelecionada.imagemUrl}
                alt={bandaSelecionada.nome}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-xs text-gray-400">
                {turneSelecionada ? "🎤" : "🎸"}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-semibold">
              {bandaSelecionada?.nome || "Selecione"}
            </h2>
            <p className="text-neutral-700 text-sm">
              TURNÊ:{" "}
              {turneSelecionada?.nomeTurne || turneSelecionada?.nome || "Todas"}
            </p>
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

        <ArtistaModal
          open={artistOpen}
          onSelect={handleBandaSelectFromModal}
          onClose={() => setArtistOpen(false)}
        />
        <TurneModal
          open={tourOpen}
          onSelect={handleTurneSelectFromModal}
          onClose={() => setTourOpen(false)}
        />
      </div>
    </header>
  );
};

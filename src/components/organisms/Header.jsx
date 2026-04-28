import React from "react";
import { Menu } from "lucide-react";
import { useHeaderLogic } from "../../hooks/useHeaderLogic";
import { ArtistaModal } from "./ArtistaModal";
import { TurneModal } from "./TurneModal";
import { BandaTurneSelector } from "../ModalEventos/BandaTurneSelector";
import { HeaderDrilldownTrigger } from "../molecules/HeaderDrilldownTrigger";

export const Header = ({
  bandas,
  turnes,
  bandaSelecionada,
  turneSelecionada,
  onBandaChange,
  onTurneChange,
  showBandaSelector = true,
  showTurneSelector = true,
  onMenuClick,
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
    <header className="w-full mb-2 flex flex-wrap sm:flex-nowrap items-center gap-3">
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] rounded-md transition-colors"
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      )}
      
      <div className="relative flex justify-between items-center h-16 w-full max-w-full sm:max-w-[320px] px-4 surface-card border-[var(--border-hover)] hover:border-[var(--border-strong)] transition-all duration-150">
        {showBandaSelector && (
          <BandaTurneSelector
            open={isOpen}
            active={activeOption}
            bandas={bandas}
            turnes={turnes}
            bandaSelecionada={bandaSelecionada}
            turneSelecionada={turneSelecionada}
            onOpenArtist={handleOpenArtist}
            onOpenTour={handleOpenTour}
            onBandaSelect={handleBandaSelect}
            onTurneSelect={handleTurneSelect}
            showBandaSelector={showBandaSelector}
            showTurneSelector={showTurneSelector}
          />
        )}
        <HeaderDrilldownTrigger
          bandaSelecionada={bandaSelecionada}
          turneSelecionada={turneSelecionada}
          isOpen={isOpen}
          onToggle={alternarDropdown}
        />

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

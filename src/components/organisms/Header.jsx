import React from "react";
import { useHeaderLogic } from "../../hooks/useHeaderLogic";
import { ArtistaModal } from "../Dashboard/ArtistaModal";
import { TurneModal } from "../Dashboard/TurneModal";
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
        <header className="w-full mb-2">
            <div className="relative flex justify-between items-center h-16 w-full max-w-[320px] px-4 surface-card border-[var(--border-hover)] hover:border-[var(--border-strong)] transition-all duration-150">
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

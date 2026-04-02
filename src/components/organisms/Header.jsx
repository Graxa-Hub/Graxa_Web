import { ChevronDown, ChevronUp } from "lucide-react";
import React from "react";
import { useHeaderLogic } from "../../hooks/useHeaderLogic";
import { ArtistaModal } from "../Dashboard/ArtistaModal";
import { TurneModal } from "../Dashboard/TurneModal";
import { BandaTurneSelector } from "../ModalEventos/BandaTurneSelector";

export const Header = ({
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
        <header className="flex justify-between items-center w-full mb-2 gap-3">
            <div className="relative flex justify-between items-center h-16 w-full max-w-xl px-4 surface-card border-[var(--border-hover)] hover:border-[var(--border-strong)] transition-all duration-150">
                <BandaTurneSelector
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
                    <div className="h-11 w-11 rounded-full overflow-hidden bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center">
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
                            <span className="text-xs text-[var(--text-muted)]">
                                {turneSelecionada ? "🎤" : "🎸"}
                            </span>
                        )}
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                            {bandaSelecionada?.nome || "Selecione"}
                        </h2>
                        <p className="text-[var(--text-muted)] text-xs uppercase tracking-wide">
                            TURNÊ: {turneSelecionada?.nomeTurne || turneSelecionada?.nome || "Todas"}
                        </p>
                    </div>
                </div>

                <div className="text-[var(--text-secondary)]">
                    {isOpen ? (
                        <ChevronDown className="cursor-pointer" onClick={alternarDropdown} />
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

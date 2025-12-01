import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ArtistaModal } from "./ArtistaModal";
import { TurneModal } from "./TurneModal";
import { Notificacao } from "../Notificacao/Notificacao";
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
  const [isOpen, setOpen] = useState(false);
  const [artistOpen, setArtistOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(null);

  // Turnês da banda selecionada
  const turnesDaBanda = useMemo(() => {
    if (!bandaSelecionada) return [];
    return turnes.filter(
      (t) => String(t.banda?.id || t.bandaId) === String(bandaSelecionada.id)
    );
  }, [turnes, bandaSelecionada]);

  const alternarDropdown = useCallback(() => setOpen((prev) => !prev), []);
  const fecharDropdown = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && fecharDropdown();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, fecharDropdown]);

  const handleOpenArtist = useCallback(() => {
    setActiveOption("artist");
    setArtistOpen(true);
    fecharDropdown();
  }, [fecharDropdown]);

  const handleOpenTour = useCallback(() => {
    setActiveOption("tour");
    setTourOpen(true);
    fecharDropdown();
  }, [fecharDropdown]);

  const handleBandaSelect = useCallback(
    (banda) => {
      onBandaChange(banda);
      onTurneChange(null); // reset turnê ao trocar banda
      fecharDropdown();
    },
    [onBandaChange, onTurneChange, fecharDropdown]
  );

  const handleTurneSelect = useCallback(
    (turne) => {
      onTurneChange(turne);
      fecharDropdown();
    },
    [onTurneChange, fecharDropdown]
  );

  const handleBandaSelectFromModal = useCallback(
    (banda) => {
      onBandaChange(banda);
      setArtistOpen(false);
    },
    [onBandaChange]
  );

  const handleTurneSelectFromModal = useCallback(
    (turne) => {
      onTurneChange(turne);
      const turneIdBanda = turne.banda?.id || turne.bandaId;
      if (turneIdBanda && turneIdBanda !== bandaSelecionada?.id) {
        const banda = bandas.find((b) => b.id === turneIdBanda);
        if (banda) onBandaChange(banda);
      }
      setTourOpen(false);
    },
    [bandas, bandaSelecionada, onBandaChange, onTurneChange]
  );

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
      <Notificacao />
    </header>
  );
};

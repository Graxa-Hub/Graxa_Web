import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { ArtistaModal } from "./ArtistaModal";
import { TurneModal } from "./TurneModal";
import { useTurnes } from "../../hooks/useTurnes";
import { useBandas } from "../../hooks/useBandas";

export const Header = ({ circulo, onBandaChange, onTurneChange }) => {
  const [isOpen, setOpen] = useState(false);
  const [artistOpen, setArtistOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [activeOption, setActiveOption] = useState(null);
  
  const { turnes, listarTurnes } = useTurnes();
  const { bandas, listarBandas } = useBandas();
  
  const [bandaSelecionada, setBandaSelecionada] = useState(null);
  const [turneSelecionada, setTurneSelecionada] = useState(null);

  useEffect(() => {
    listarBandas();
    listarTurnes();
  }, [listarBandas, listarTurnes]);

  useEffect(() => {
    if (bandas.length > 0 && !bandaSelecionada) {
      setBandaSelecionada(bandas[0]);
    }
  }, [bandas, bandaSelecionada]);

  // ✅ Filtra turnês da banda selecionada
  const turnesDaBanda = bandaSelecionada 
    ? turnes.filter(turne => {
        const turneIdBanda = turne.banda?.id || turne.bandaId;
        return turneIdBanda === bandaSelecionada.id;
      })
    : [];

  console.log('[Header] Banda selecionada:', bandaSelecionada?.nome);
  console.log('[Header] Total de turnês:', turnes.length);
  console.log('[Header] Turnês filtradas da banda:', turnesDaBanda.length);

  // ✅ Quando muda a banda, reseta a turnê para null (mostra todas)
  useEffect(() => {
    setTurneSelecionada(null);
  }, [bandaSelecionada]);

  // ✅ Notifica mudanças
  useEffect(() => {
    if (onBandaChange && bandaSelecionada) {
      onBandaChange(bandaSelecionada);
    }
  }, [bandaSelecionada, onBandaChange]);

  useEffect(() => {
    if (onTurneChange !== undefined) {
      onTurneChange(turneSelecionada); // null = todas as turnês
    }
  }, [turneSelecionada, onTurneChange]);

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
    fecharDropdown();
  };

  const handleOpenTour = () => {
    setActiveOption("tour");
    setTourOpen(true);
    fecharDropdown();
  };

  const handleBandaSelect = (banda) => {
    console.log('[Header] Banda selecionada no dropdown:', banda);
    setBandaSelecionada(banda);
    fecharDropdown();
  };

  const handleTurneSelect = (turne) => {
    console.log('[Header] Turnê selecionada no dropdown:', turne);
    setTurneSelecionada(turne); // pode ser null para "Todas"
    fecharDropdown();
  };

  const handleBandaSelectFromModal = (banda) => {
    console.log('[Header] Banda selecionada no modal:', banda);
    setBandaSelecionada(banda);
    setArtistOpen(false);
  };

  const handleTurneSelectFromModal = (turne) => {
    console.log('[Header] Turnê selecionada no modal:', turne);
    setTurneSelecionada(turne);
    
    const turneIdBanda = turne.banda?.id || turne.bandaId;
    if (turneIdBanda && turneIdBanda !== bandaSelecionada?.id) {
      const banda = bandas.find(b => b.id === turneIdBanda);
      if (banda) {
        console.log('[Header] Atualizando banda para:', banda.nome);
        setBandaSelecionada(banda);
      }
    }
    setTourOpen(false);
  };

  const recarregarDados = () => {
    listarBandas();
    listarTurnes();
  };

  return (
    <header className="flex h-14 mb-5">
      <div className="relative flex justify-between items-center h-full max-w-70 w-full sm:w-1/3 px-4 bg-white rounded-lg">
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
          {/* FOTO DINÂMICA COM BORDA VERDE */}
          <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-green-500">
            {turneSelecionada
              ? (
                turneSelecionada.imagemUrl
                  ? <img src={turneSelecionada.imagemUrl} alt={turneSelecionada.nomeTurne || turneSelecionada.nome} className="object-cover w-full h-full" />
                  : <span className="text-xs text-gray-400">🎤</span>
              )
              : (
                bandaSelecionada?.imagemUrl
                  ? <img src={bandaSelecionada.imagemUrl} alt={bandaSelecionada.nome} className="object-cover w-full h-full" />
                  : <span className="text-xs text-gray-400">🎸</span>
              )
            }
          </div>
          <div>
            <h2 className="font-semibold">
              {bandaSelecionada?.nome || "Selecione"}
            </h2>
            <p className="text-neutral-700 text-sm">
              TURNÊ: {turneSelecionada?.nomeTurne || turneSelecionada?.nome || "Todas"}
            </p>
          </div>
        </div>

        <div>
          {isOpen ? (
            <ChevronDown className="cursor-pointer" onClick={alternarDropdown} />
          ) : (
            <ChevronUp className="cursor-pointer" onClick={alternarDropdown} />
          )}
        </div>

        <ArtistaModal 
          open={artistOpen} 
          onSelect={handleBandaSelectFromModal}
          onClose={() => {
            setArtistOpen(false);
            recarregarDados();
          }} 
        />
        <TurneModal 
          open={tourOpen}
          onSelect={handleTurneSelectFromModal}
          onClose={() => {
            setTourOpen(false);
            recarregarDados();
          }} 
        />
      </div>
    </header>
  );
};

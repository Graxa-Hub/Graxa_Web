import React, { useEffect, useRef } from "react";
import { useBandas } from "../../hooks/useBandas";

export const ArtistaModal = ({ open = false, onClose = () => {}, onSelect = () => {} }) => {
  const { bandas, loading, listarBandas } = useBandas();
  const jaCarregou = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Carrega bandas apenas uma vez quando abre o modal
  useEffect(() => {
    if (open && !jaCarregou.current && !loading && bandas.length === 0) {
      console.log('[ArtistaModal] Carregando bandas...');
      jaCarregou.current = true;
      listarBandas();
    }
    
    // Reset quando fecha
    if (!open) {
      jaCarregou.current = false;
    }
  }, [open, listarBandas, loading, bandas.length]);

  if (!open) return null;

  const handleBandaClick = (banda) => {
    onSelect(banda);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden="true" />
      <div
        className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-4">
          <h2 className="text-2xl font-semibold">Artistas/Bandas</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Selecione o artista de sua preferência
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando bandas...</p>
            </div>
          </div>
        ) : bandas.length === 0 ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-gray-400">Nenhuma banda cadastrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {bandas.map((banda) => (
              <div
                key={banda.id}
                className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                role="button"
                tabIndex={0}
                onClick={() => handleBandaClick(banda)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleBandaClick(banda);
                  }
                }}
              >
                <img
                  src={banda.imagemUrl}
                  alt={banda.nome}
                  className="w-full h-full object-cover transition duration-300 ease-out group-hover:blur-sm group-hover:scale-110"
                  onError={(e) => {
                    console.error('[ArtistaModal] Erro ao carregar imagem:', banda.nome);
                    e.target.src = '/placeholder-banda.png';
                  }}
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-transparent to-transparent">
                  <span className="absolute bottom-0 left-0 right-0 px-4 py-3 text-white font-semibold text-sm bg-black/40 backdrop-blur-sm">
                    {banda.nome}
                  </span>
                </div>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="px-4 py-2 rounded-lg text-white font-semibold text-base bg-black/60 backdrop-blur-sm">
                    Selecionar
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from "react";
import { useTurnes } from "../../hooks/useTurnes";

export const TurneModal = ({ open = false, onClose = () => {}, onSelect = () => {} }) => {
  const { turnes, loading, listarTurnes } = useTurnes();
  const jaCarregou = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Carrega turnês apenas uma vez quando abre o modal
  useEffect(() => {

    if (open && !jaCarregou.current) {

      jaCarregou.current = true;
      listarTurnes();
    }
    
    // Reset quando fecha
    if (!open) {
      jaCarregou.current = false;
    }
  }, [open, listarTurnes]); // ✅ Apenas open e listarTurnes

  if (!open) return null;

  const handleTurneClick = (turne) => {
    onSelect(turne);
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
          <h2 className="text-2xl font-semibold">Turnês</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Selecione a turnê
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Carregando turnês...</p>
            </div>
          </div>
        ) : turnes.length === 0 ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-gray-400">Nenhuma turnê cadastrada</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {turnes.map((turne) => (
              <div
                key={turne.id}
                className="flex gap-4 items-center p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-200 hover:border-blue-300"
                role="button"
                tabIndex={0}
                onClick={() => handleTurneClick(turne)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleTurneClick(turne);
                  }
                }}
              >
                <img 
                  src={turne.imagemUrl}
                  alt={turne.nomeTurne || turne.nome}
                  className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/64x64/e2e8f0/64748b?text=Erro';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-gray-800">
                    {turne.nomeTurne || turne.nome}
                  </h3>
                  <p className="text-neutral-500 text-sm truncate">
                    {turne.descricao || 'Sem descrição'}
                  </p>
                  {turne.banda?.nome && (
                    <p className="text-xs text-blue-600 mt-1">
                      {turne.banda.nome}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

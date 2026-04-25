import React, { useEffect, useRef } from "react";
import { useBandas } from "../../hooks/useBandas";

export function ArtistaModal({
  open = false,
  onClose = () => {},
  onSelect = () => {},
}) {
  const { bandas, loading, listarBandas } = useBandas();
  const jaCarregou = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && !jaCarregou.current && !loading && bandas.length === 0) {
      jaCarregou.current = true;
      listarBandas();
    }
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
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className="modal-panel relative z-10 w-full max-w-4xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-5 flex items-end justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">
              Artistas/Bandas
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Selecione o artista de sua preferencia
            </p>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
              <p className="text-[var(--text-muted)]">Carregando bandas...</p>
            </div>
          </div>
        ) : bandas.length === 0 ? (
          <div className="flex items-center justify-center p-12 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface)]">
            <p className="text-[var(--text-muted)]">Nenhuma banda cadastrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {bandas.map((banda) => (
              <div
                key={banda.id}
                className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] cursor-pointer border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-soft)] transition-all"
                role="button"
                tabIndex={0}
                onClick={() => handleBandaClick(banda)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleBandaClick(banda);
                }}
              >
                <img
                  src={banda.imagemUrl}
                  alt={banda.nome}
                  className="w-full h-full object-cover transition duration-300 ease-out group-hover:scale-105 group-hover:opacity-35"
                  onError={(e) => {
                    e.target.src = "/placeholder-banda.png";
                  }}
                />
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 via-black/15 to-transparent">
                  <span className="text-sm font-semibold text-white truncate">
                    {banda.nome}
                  </span>
                  <span className="mt-2 w-fit rounded-[var(--radius-sm)] border border-white/20 bg-black/35 px-3 py-1 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
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
}

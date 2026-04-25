import React, { useEffect, useRef } from "react";
import { useTurnes } from "../../hooks/useTurnes";

export function TurneModal({
  open = false,
  onClose = () => {},
  onSelect = () => {},
}) {
  const { turnes, loading, listarTurnes } = useTurnes();
  const jaCarregou = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open && !jaCarregou.current) {
      jaCarregou.current = true;
      listarTurnes();
    }
    if (!open) jaCarregou.current = false;
  }, [open, listarTurnes]);

  if (!open) return null;

  const handleTurneClick = (turne) => {
    onSelect(turne);
    onClose();
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        className="modal-panel relative z-10 w-full max-w-3xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-5 border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Turnes
          </h2>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Selecione a turne
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
              <p className="text-[var(--text-muted)]">Carregando turnes...</p>
            </div>
          </div>
        ) : turnes.length === 0 ? (
          <div className="flex items-center justify-center p-12 rounded-[var(--radius-md)] border border-dashed border-[var(--border)] bg-[var(--surface)]">
            <p className="text-[var(--text-muted)]">Nenhuma turne cadastrada</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {turnes.map((turne) => (
              <div
                key={turne.id}
                className="flex gap-4 items-center p-4 rounded-[var(--radius-md)] cursor-pointer transition-all border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[var(--border-hover)]"
                role="button"
                tabIndex={0}
                onClick={() => handleTurneClick(turne)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    handleTurneClick(turne);
                }}
              >
                <img
                  src={turne.imagemUrl}
                  alt={turne.nomeTurne || turne.nome}
                  className="h-16 w-16 rounded-[var(--radius-sm)] object-cover flex-shrink-0 border border-[var(--border)]"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/64x64/2f2f2f/e8e8e6?text=Erro";
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base text-[var(--text-primary)]">
                    {turne.nomeTurne || turne.nome}
                  </h3>
                  <p className="text-[var(--text-muted)] text-sm truncate">
                    {turne.descricao || "Sem descricao"}
                  </p>
                  {turne.banda?.nome && (
                    <p className="text-xs text-[var(--accent)] mt-1">
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
}

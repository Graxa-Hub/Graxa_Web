import React from "react";

export const BandaTurneSelector = ({
  open,
  bandas = [],
  turnes = [],
  bandaSelecionada,
  turneSelecionada,
  onOpenArtist,
  onOpenTour,
  onBandaSelect,
  onTurneSelect,
}) => {
  if (!open) return null;

  return (
    <div className="absolute top-full mt-2 z-50 translate-x-[-15px]" role="menu">
      <div className="w-[320px] surface-card overflow-hidden shadow-[var(--shadow-card)]">
        <div className="border-b border-[var(--border)]">
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface)] border-b border-[var(--border)]">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">🎸 Bandas</span>
            <button onClick={onOpenArtist} className="text-xs text-[var(--accent)] hover:text-[var(--text-primary)] font-medium transition-colors">
              + Gerenciar
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {bandas.length > 0 ? (
              bandas.map((banda) => (
                <button
                  key={banda.id}
                  onClick={() => onBandaSelect && onBandaSelect(banda)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-[var(--surface-hover)] transition-colors border-l-2 ${
                    bandaSelecionada?.id === banda.id
                      ? "bg-[var(--surface-hover)] text-[var(--text-primary)] border-[var(--accent)] font-medium"
                      : "text-[var(--text-secondary)] border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {bandaSelecionada?.id === banda.id && <span className="text-[var(--accent)]">✓</span>}
                    <span>{banda.nome}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-[var(--text-muted)] text-center">Nenhuma banda cadastrada</div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface)] border-b border-[var(--border)]">
            <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">🎤 Turnês</span>
            <button onClick={onOpenTour} className="text-xs text-[var(--accent)] hover:text-[var(--text-primary)] font-medium transition-colors">
              + Gerenciar
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto">
            <button
              onClick={() => onTurneSelect && onTurneSelect(null)}
              className={`w-full text-left px-4 py-2.5 hover:bg-[var(--surface-hover)] transition-colors border-l-2 ${
                turneSelecionada === null
                  ? "bg-[var(--surface-hover)] text-[var(--text-primary)] border-[var(--accent)] font-medium"
                  : "text-[var(--text-secondary)] border-transparent"
              }`}
            >
              <div className="flex items-center gap-2">
                {turneSelecionada === null && <span className="text-[var(--accent)]">✓</span>}
                <span>📋 Todas as Turnês</span>
              </div>
            </button>

            {turnes.length > 0 ? (
              turnes.map((turne) => (
                <button
                  key={turne.id}
                  onClick={() => onTurneSelect && onTurneSelect(turne)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-[var(--surface-hover)] transition-colors border-l-2 ${
                    turneSelecionada?.id === turne.id
                      ? "bg-[var(--surface-hover)] text-[var(--text-primary)] border-[var(--accent)] font-medium"
                      : "text-[var(--text-secondary)] border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {turneSelecionada?.id === turne.id && <span className="text-[var(--accent)]">✓</span>}
                    <span>{turne.nomeTurne || turne.nome}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-[var(--text-muted)] text-center">
                {bandaSelecionada ? "Nenhuma turnê cadastrada para esta banda" : "Selecione uma banda"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BandaTurneSelector;

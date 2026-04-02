import { ChevronDown, ChevronUp } from "lucide-react";

export const HeaderDrilldownTrigger = ({
  bandaSelecionada,
  turneSelecionada,
  isOpen,
  onToggle,
}) => {
  return (
    <>
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
            TURNE: {turneSelecionada?.nomeTurne || turneSelecionada?.nome || "Todas"}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        aria-label={isOpen ? "Fechar selecao" : "Abrir selecao"}
      >
        {isOpen ? <ChevronDown className="cursor-pointer" /> : <ChevronUp className="cursor-pointer" />}
      </button>
    </>
  );
};

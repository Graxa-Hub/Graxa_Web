import React from "react";

const Stepper = ({
  etapaAtual,
  setEtapaAtual,
  etapas,
  onEtapaAnterior,
  onVisaoEvento,
  onProximaEtapa,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
      <div className="flex min-w-0 flex-1 items-center">
        {etapas.map((etapa, index) => {
          const stepNum = index + 1;
          return (
            <div
              key={index}
              className="group flex cursor-pointer items-center"
              onClick={() => setEtapaAtual(stepNum)}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                  etapaAtual === stepNum
                    ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                    : "bg-[var(--surface-hover)] text-[var(--text-muted)]"
                }`}
              >
                {stepNum}
              </div>
              <span
                className={`ml-3 whitespace-nowrap text-sm font-medium ${etapaAtual === stepNum ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}
              >
                {etapa.label}
              </span>
              {index < etapas.length - 1 && (
                <span className="mx-6 text-[var(--border-strong)]">/</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="ml-auto flex flex-shrink-0 items-center gap-2">
        {onEtapaAnterior && (
          <button
            className="px-5 py-2 bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-[var(--radius-md)] hover:bg-[var(--surface-hover)] transition-colors font-medium"
            onClick={onEtapaAnterior}
            title="Voltar"
            aria-label="Voltar"
          >
            {"<"}
          </button>
        )}

        {onVisaoEvento && (
          <button
            className="px-5 py-2 bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-[var(--radius-md)] hover:bg-[rgba(147,197,253,0.22)] transition-colors font-medium"
            onClick={onVisaoEvento}
          >
            Visão Negócio
          </button>
        )}

        {onProximaEtapa && (
          <button
            className="px-5 py-2 bg-[var(--surface-elevated)] text-[var(--text-primary)] rounded-[var(--radius-md)] hover:bg-[rgba(134,239,172,0.22)] transition-colors font-medium"
            onClick={onProximaEtapa}
            title="Avançar"
            aria-label="Avançar"
          >
            {">"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Stepper;

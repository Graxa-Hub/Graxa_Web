import React from "react";

const Stepper = ({ etapaAtual, setEtapaAtual, etapas, onVisaoEvento }) => {
  return (
    <div className="flex justify-between items-center border-b pb-4 border-[var(--border)]">
      {etapas.map((etapa, index) => {
        const stepNum = index + 1;
        return (
          <div
            key={index}
            className="flex items-center cursor-pointer group"
            onClick={() => setEtapaAtual(stepNum)}
          >
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${etapaAtual === stepNum
                  ? "bg-[var(--surface-elevated)] text-white hover:bg-[var(--surface-hover)]"
                  : "bg-[var(--surface-hover)] text-[var(--text-muted)]"
                }`}
            >
              {stepNum}
            </div>
            <span className={`ml-3 text-sm font-medium ${etapaAtual === stepNum ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-muted)]"}`}>{etapa.label}</span>
            {index < etapas.length - 1 && (
              <span className="mx-6 text-[var(--border-strong)]">/</span>
            )}
          </div>
        );
      })}
      {/* Botão Visão do Evento */}
      {onVisaoEvento && (
        <button
          className="ml-auto px-5 py-2 bg-[var(--surface-elevated)] text-white rounded-[var(--radius-md)] hover:bg-[var(--surface-hover)] font-medium"
          onClick={onVisaoEvento}
        >
          Visão do Evento
        </button>
      )}
    </div>
  );
};

export default Stepper;
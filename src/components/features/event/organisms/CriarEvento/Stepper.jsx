import { ChevronLeft, ChevronRight, LayoutDashboard } from "lucide-react";

const Stepper = ({
  etapaAtual,
  setEtapaAtual,
  etapas,
  onEtapaAnterior,
  onVisaoEvento,
  onProximaEtapa,
}) => {
  const indexAtual = etapaAtual - 1;
  const proximaEtapa = etapas[indexAtual + 1];

  return (
    <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-6 mb-8">
      {/* Indicadores de Etapa - DESKTOP (Full) */}
      <div className="hidden lg:block overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max items-center gap-4">
          {etapas.map((etapa, index) => {
            const stepNum = index + 1;
            const isActive = etapaAtual === stepNum;
            const isCompleted = etapaAtual > stepNum;

            return (
              <div
                key={index}
                className="flex items-center"
                onClick={() => setEtapaAtual(stepNum)}
              >
                <div className="group flex cursor-pointer items-center transition-all">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--accent)] text-white shadow-[0_0_15px_rgba(200,80,60,0.4)]"
                        : isCompleted
                          ? "bg-[var(--surface-hover)] text-[var(--accent)] border border-[var(--accent)]"
                          : "bg-[var(--surface-elevated)] text-[var(--text-muted)] border border-transparent"
                    }`}
                  >
                    {isCompleted ? "✓" : stepNum}
                  </div>
                  <span
                    className={`ml-3 whitespace-nowrap text-sm font-medium transition-colors ${
                      isActive ? "text-[var(--text-primary)] font-semibold" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {etapa.label}
                  </span>
                </div>
                {index < etapas.length - 1 && (
                  <div className="mx-4 h-[1px] w-8 bg-[var(--border)]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Indicadores de Etapa - TABLET/MOBILE (2-Step Sliding) */}
      <div className="flex lg:hidden items-center justify-between bg-[var(--surface-hover)]/30 p-3 rounded-xl border border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white text-xs font-bold shadow-lg">
            {etapaAtual}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Atual</span>
            <span className="text-sm font-bold text-[var(--text-primary)] leading-tight">{etapas[indexAtual].label}</span>
          </div>
        </div>

        {proximaEtapa && (
          <>
            <ChevronRight size={14} className="text-[var(--text-muted)]" />
            <div className="flex items-center gap-3 opacity-60">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-elevated)] text-[var(--text-muted)] text-xs font-bold border border-[var(--border)]">
                {etapaAtual + 1}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-bold">Próxima</span>
                <span className="text-sm font-medium text-[var(--text-secondary)] leading-tight">{proximaEtapa.label}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Botões de Navegação */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          {onEtapaAnterior && (
            <button
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--surface-elevated)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all border border-[var(--border)] shadow-sm"
              onClick={onEtapaAnterior}
              title="Voltar"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {onVisaoEvento && (
            <button
              className="flex h-11 items-center gap-2 px-4 rounded-xl bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-all border border-[var(--border)] text-sm font-medium shadow-sm"
              onClick={onVisaoEvento}
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Visão Negócio</span>
            </button>
          )}
        </div>

        {onProximaEtapa && (
          <button
            className="flex h-11 items-center gap-3 px-8 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 active:scale-95 transition-all font-bold text-sm shadow-[0_4px_15px_rgba(200,80,60,0.3)]"
            onClick={onProximaEtapa}
          >
            {etapaAtual < etapas.length ? (
              <>
                <span>Próximo</span>
                <ChevronRight size={20} />
              </>
            ) : (
              <span>Finalizar</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Stepper;

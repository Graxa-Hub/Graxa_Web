import React from "react";
import { ArrowRight, Eye } from "lucide-react";
import { buttonStyles, cn, sectionSubtitle, sectionTitle } from "./uiStyles";

const Stepper = ({ etapaAtual, setEtapaAtual, etapas, onVisaoEvento }) => {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
            Fluxo guiado
          </p>
          <h1 className={cn(sectionTitle, "text-xl md:text-2xl")}>
            Criar evento
          </h1>
          <p className={sectionSubtitle}>
            Avance entre as etapas para configurar local, equipe, logística, agenda e extras.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {etapas.map((etapa, index) => {
            const stepNum = index + 1;
            const isActive = etapaAtual === stepNum;
            const isDone = etapaAtual > stepNum;

            return (
              <React.Fragment key={etapa.label}>
                <button
                  type="button"
                  className={cn(
                    "group flex min-w-[160px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-200",
                    isActive && "border-emerald-300 bg-emerald-50 shadow-[0_12px_25px_rgba(16,185,129,0.16)]",
                    isDone && "border-slate-200 bg-slate-50 hover:border-emerald-200 hover:bg-emerald-50/60",
                    !isActive && !isDone && "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                  )}
                  onClick={() => setEtapaAtual(stepNum)}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold transition-colors",
                      isActive && "bg-emerald-500 text-white",
                      isDone && "bg-slate-900 text-white",
                      !isActive && !isDone && "bg-slate-100 text-slate-500 group-hover:bg-slate-200",
                    )}
                  >
                    {stepNum}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Etapa {stepNum}
                    </p>
                    <span className={cn("block truncate text-sm font-semibold", isActive ? "text-slate-950" : "text-slate-600")}>
                      {etapa.label}
                    </span>
                  </div>
                </button>

                {index < etapas.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 text-slate-300 xl:block" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {onVisaoEvento && (
          <button className={buttonStyles.secondary} onClick={onVisaoEvento}>
            <Eye className="mr-2 h-4 w-4" />
            Visão do Evento
          </button>
        )}
      </div>
    </div>
  );
};

export default Stepper;

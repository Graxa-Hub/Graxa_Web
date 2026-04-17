import { memo, useState } from "react";
import { Switcher } from "../atoms/Switcher";
import { AnotacoesCard } from "../molecules/AnotacoesCard";
import { PorcentagemCard } from "../molecules/PorcentagemCard";
import { ClimaCard } from "./ClimaCard";
import { MapCard } from "./MapCard";

export const PainelDireito = memo(
  ({ agendaSelecionada, progresso, cidade, lat, lon }) => {
    const [activeView, setActiveView] = useState("progress");

    const renderConteudoDinamico = () => {
      if (!agendaSelecionada) {
        return (
          <div className="min-h-0 flex-1">
            <MapCard lat={lat} lon={lon} />
          </div>
        );
      }

      const tipo =
        agendaSelecionada.dadosOriginais?.tipo ||
        agendaSelecionada.type ||
        "tecnico";

      if (tipo === "deslocamento") {
        return (
          <div className="min-h-0 flex-1">
            <MapCard
              lat={lat}
              lon={lon}
              origem={agendaSelecionada.dadosOriginais?.origem}
              destino={agendaSelecionada.dadosOriginais?.destino}
              titulo={agendaSelecionada.title}
            />
          </div>
        );
      }

      return (
        <div className="min-h-0 flex-1 overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-elevated)] p-6 shadow-[var(--shadow-soft)]">
          <AnotacoesCard
            title={agendaSelecionada.title}
            content={agendaSelecionada.description}
          />
        </div>
      );
    };

    return (
      <div className="flex h-full min-h-0 flex-col gap-4">
        {renderConteudoDinamico()}

        <div className="mt-2 flex flex-row items-end gap-3 p-1">
          <Switcher activeView={activeView} onViewChange={setActiveView} />

          <div className="flex-1 overflow-visible">
            {activeView === "progress" ? (
              <div className="animate-in slide-in-from-bottom-2 fade-in overflow-visible duration-300">
                <PorcentagemCard value={progresso} />
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-2 fade-in overflow-visible duration-300">
                <ClimaCard cidade={cidade} lat={lat} lon={lon} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

PainelDireito.displayName = "PainelDireito";

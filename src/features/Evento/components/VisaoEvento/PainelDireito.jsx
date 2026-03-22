import React, { memo, useState } from "react";
import { Porcentagem } from "./Porcentagem";
import { ClimaCard } from "./ClimaCard";
import { AnotacoesCard } from "./AnotacoesCard";
import { MapCard } from "./MapCard";
import { Switcher } from "../../../../components/atoms/Switcher";

export const PainelDireito = memo(({ agendaSelecionada, progresso, cidade, lat, lon }) => {
  const [activeView, setActiveView] = useState("progress");

  const renderConteudoDinamico = () => {
    if (!agendaSelecionada) {
      return (
        <div className="flex-1 min-h-0">
          <MapCard lat={lat} lon={lon} />
        </div>
      );
    }

    const tipo = agendaSelecionada.dadosOriginais?.tipo || "tecnico";

    if (tipo === "deslocamento") {
      return (
        <div className="flex-1 min-h-0">
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
      <div className="surface-card p-5 flex-1 min-h-0 overflow-hidden">
        <AnotacoesCard titulo={agendaSelecionada.title} descricao={agendaSelecionada.description} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      {renderConteudoDinamico()}

      <div className="surface-card flex flex-row items-stretch gap-3 p-4 overflow-hidden">
        <Switcher activeView={activeView} onViewChange={setActiveView} />
        <div className="flex-1 overflow-visible">
          {activeView === "progress" ? <Porcentagem percent={progresso} /> : <ClimaCard cidade={cidade} lat={lat} lon={lon} />}
        </div>
      </div>
    </div>
  );
});

PainelDireito.displayName = "PainelDireito";

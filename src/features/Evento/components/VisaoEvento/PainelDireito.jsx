// src/components/VisaoEvento/PainelDireito.jsx
import React, { memo, useState } from "react";
import { Porcentagem } from "./Porcentagem";
import { ClimaCard } from "./ClimaCard";
import { AnotacoesCard } from "./ANotacoesCard";
import { MapCard } from "./MapCard";
import { Switcher } from "../../../../components/atoms/Switcher";

export const PainelDireito = memo(({
  agendaSelecionada,
  progresso,
  cidade,
  lat,
  lon
}) => {
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

    // Para anotações, mantemos o estilo de card pois o MapCard já tem o dele internamente
    return (
      <div className="bg-white rounded-md shadow-lg p-6 flex-1 min-h-0 overflow-hidden">
        <AnotacoesCard
          titulo={agendaSelecionada.title}
          descricao={agendaSelecionada.description}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      {renderConteudoDinamico()}

      <div className="mt-2 flex flex-row items-end gap-3 p-1">
        <Switcher activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1 overflow-visible">
          {activeView === "progress" ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-visible">
              <Porcentagem percent={progresso} />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-visible">
              <ClimaCard cidade={cidade} lat={lat} lon={lon} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PainelDireito.displayName = 'PainelDireito';
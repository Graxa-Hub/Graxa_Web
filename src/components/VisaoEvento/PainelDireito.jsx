// src/components/VisaoEvento/PainelDireito.jsx
import React, { memo } from "react";
import { Porcentagem } from "./Porcentagem";
import { ClimaCard } from "./ClimaCard";
import { AnotacoesCard } from "./ANotacoesCard";
import { MapCard } from "./MapCard";

export const PainelDireito = memo(({ 
  agendaSelecionada, 
  progresso, 
  cidade, 
  lat, 
  lon 
}) => {

  const renderConteudoDinamico = () => {
    if (!agendaSelecionada) {
      return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1 min-h-0">
          <MapCard lat={lat} lon={lon} />
        </div>
      );
    }

    const tipo = agendaSelecionada.dadosOriginais?.tipo || "tecnico";

    if (tipo === "deslocamento") {
      return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex-1 min-h-0">
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
      <div className="bg-white rounded-lg shadow-lg p-6 flex-1 min-h-0 overflow-hidden">
        <AnotacoesCard 
          titulo={agendaSelecionada.title}
          descricao={agendaSelecionada.description}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 min-h-0">
      {renderConteudoDinamico()}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-row gap-6">
          <div className="w-full">
            <Porcentagem percent={progresso} />
          </div>
          <div className="w-full">
            <ClimaCard cidade={cidade} />
          </div>
        </div>
      </div>
    </div>
  );
});

PainelDireito.displayName = 'PainelDireito';
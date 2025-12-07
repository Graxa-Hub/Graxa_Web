// src/components/VisaoEvento/AgendaList.jsx
import React, { memo } from "react";
import { AgendaCard } from "./AgendaCard";

export const AgendaList = memo(({ agendas, agendaSelecionada, onSelecionarAgenda }) => {
  return (
    <div className="col-span-2 bg-white rounded-lg shadow-lg p-6 overflow-hidden">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Agenda do Dia</h3>
      <div className="space-y-3 overflow-y-auto h-full pr-3">
        {agendas.length > 0 ? (
          agendas.map((item) => (
            <div 
              key={item.id} 
              className={item.passed ? "opacity-40" : ""}
              onClick={() => onSelecionarAgenda(item.id)}
            >
              <AgendaCard 
                {...item}
                selected={agendaSelecionada?.id === item.id}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">Nenhuma agenda cadastrada</p>
        )}
      </div>
    </div>
  );
});

AgendaList.displayName = 'AgendaList';
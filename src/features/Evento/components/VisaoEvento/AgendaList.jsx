import React, { memo } from "react";
import { AgendaCard } from "./AgendaCard";

export const AgendaList = memo(({ agendas, agendaSelecionada, onSelecionarAgenda }) => {
  return (
    <div className="surface-card overflow-hidden flex flex-col h-full p-5">
      <div className="mb-4 border-b border-[var(--border)] pb-3">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Agenda do Dia</h3>
        <p className="text-sm text-[var(--text-muted)] mt-1">Linha do tempo do evento e próximos marcos.</p>
      </div>
      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {agendas.length > 0 ? (
          agendas.map((item) => (
            <div key={item.id} className={item.passed ? "opacity-45" : ""} onClick={() => onSelecionarAgenda(item.id)}>
              <AgendaCard {...item} selected={agendaSelecionada?.id === item.id} />
            </div>
          ))
        ) : (
          <p className="text-[var(--text-muted)] text-center py-8">Nenhuma agenda cadastrada</p>
        )}
      </div>
    </div>
  );
});

AgendaList.displayName = "AgendaList";

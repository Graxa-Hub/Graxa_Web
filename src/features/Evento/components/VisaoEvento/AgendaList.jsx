import React from "react";
import { AgendaCard } from "./AgendaCard";
export const AgendaList = ({ itens = [], selectedId, onSelect }) => (
    <div className="col-span-2 surface-card p-4 overflow-hidden flex flex-col h-full">
        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 pb-3 border-b border-[var(--border)]">Agenda do Dia</h3>
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {itens.length === 0
                ? <p className="text-[var(--text-muted)] text-center py-8 text-sm">Nenhuma agenda cadastrada</p>
                : itens.map(item => <AgendaCard key={item.id} {...item} selected={item.id === selectedId} onSelect={() => onSelect?.(item)} />)
            }
        </div>
    </div>
);

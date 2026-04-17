import { AgendaCard } from "../molecules/AgendaCard";

export const AgendaList = ({ itens = [], selectedId, onSelect }) => (
  <div className="col-span-2 flex h-full flex-col overflow-hidden p-4 surface-card">
    <h3 className="mb-3 border-b border-[var(--border)] pb-3 text-sm font-bold text-[var(--text-primary)]">
      Agenda do Dia
    </h3>

    <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
      {itens.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--text-muted)]">
          Nenhuma agenda cadastrada
        </p>
      ) : (
        itens.map((item) => (
          <AgendaCard
            key={item.id}
            {...item}
            selected={item.id === selectedId}
            onSelect={() => onSelect?.(item)}
          />
        ))
      )}
    </div>
  </div>
);

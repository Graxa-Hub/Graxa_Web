import { Circle, CircleDot } from "lucide-react";

export const AgendaCard = ({
  type,
  tipo,
  title,
  titulo,
  description,
  descricao,
  timeStart,
  timeEnd,
  date,
  selected,
  onSelect,
}) => {
  const tipoAgenda = type || tipo;
  const tituloExibido = title || titulo;
  const descricaoExibida = description || descricao;
  const isShow = String(tipoAgenda || "").toUpperCase() === "SHOW";

  return (
    <div
      onClick={onSelect}
      className={`flex cursor-pointer items-start gap-4 surface-card p-4 transition-all hover:border-[var(--border-hover)] ${selected ? "border-[var(--accent)]" : ""}`}
    >
      <div>
        <p className="text-xs font-bold text-[var(--text-primary)]">
          {timeStart}
        </p>
        {timeEnd && (
          <p className="text-[10px] text-[var(--text-muted)]">ate {timeEnd}</p>
        )}
        <p className="mt-1 text-[10px] text-[var(--text-muted)]">{date}</p>
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          {isShow ? (
            <CircleDot className="h-3 w-3 flex-shrink-0 text-[var(--accent)]" />
          ) : (
            <Circle
              className={`h-3 w-3 flex-shrink-0 ${selected ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`}
            />
          )}
          <p className="truncate text-xs font-semibold text-[var(--text-primary)]">
            {tituloExibido}
          </p>
        </div>
        {descricaoExibida && (
          <p className="line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)]">
            {descricaoExibida}
          </p>
        )}
      </div>
    </div>
  );
};

import React, { memo } from "react";
import { Circle, CircleDot } from "lucide-react";

export const AgendaCard = memo(({ timeStart, timeEnd, date, title, description, active, selected }) => (
  <div
    className={`flex items-start gap-4 rounded-[var(--radius-md)] border p-4 cursor-pointer transition-all ${
      selected
        ? "border-[var(--accent)] bg-[var(--surface-hover)] shadow-[var(--shadow-soft)]"
        : active
          ? "border-[var(--border-hover)] bg-[var(--surface)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-hover)]"
    }`}
  >
    <div className="text-center w-24 flex-shrink-0">
      <p className="text-xs font-bold text-[var(--text-primary)]">{timeStart}</p>
      {timeEnd && <p className="text-[10px] text-[var(--text-muted)]">até {timeEnd}</p>}
      <p className="text-[10px] text-[var(--text-muted)] mt-1">{date}</p>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        {active ? (
          <CircleDot className="text-[var(--accent)] w-3 h-3 flex-shrink-0" />
        ) : (
          <Circle className={`w-3 h-3 flex-shrink-0 ${selected ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
        )}
        <h3 className={`font-semibold text-sm truncate ${selected || active ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
          {title}
        </h3>
      </div>
      <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed line-clamp-2">{description}</p>
    </div>
  </div>
));

AgendaCard.displayName = "AgendaCard";

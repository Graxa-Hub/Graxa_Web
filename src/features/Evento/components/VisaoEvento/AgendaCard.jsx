import { Circle, CircleDot } from "lucide-react";
export const AgendaCard = ({ tipo, titulo, descricao, timeStart, timeEnd, date, selected, onSelect }) => {
    const isShow = tipo === "SHOW";
    return (
        <div onClick={onSelect} className={`flex items-start gap-4 surface-card p-4 cursor-pointer transition-all hover:border-[var(--border-hover)] ${selected ? "border-[var(--accent)]" : ""}`}>
            <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">{timeStart}</p>
                {timeEnd && <p className="text-[10px] text-[var(--text-muted)]">até {timeEnd}</p>}
                <p className="text-[10px] text-[var(--text-muted)] mt-1">{date}</p>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    {isShow ? <CircleDot className="text-[var(--accent)] w-3 h-3 flex-shrink-0" /> : <Circle className={`w-3 h-3 flex-shrink-0 ${selected ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />}
                    <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{titulo}</p>
                </div>
                {descricao && <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">{descricao}</p>}
            </div>
        </div>
    );
};

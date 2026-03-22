import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

export const Calendar = ({ selectedDate, onDateSelect, hasEvent }) => {
    const [current, setCurrent] = useState(selectedDate ? new Date(selectedDate) : new Date());
    const year = current.getFullYear(), month = current.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const isSelected = (d) => {
        if (!d || !selectedDate) return false;
        const s = new Date(selectedDate);
        return s.getFullYear() === year && s.getMonth() === month && s.getDate() === d;
    };
    const isToday = (d) => d && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

    return (
        <div style={{ background: "var(--surface-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-soft)", padding: 16, width: 280 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <button onClick={() => setCurrent(new Date(year, month - 1))} style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <ChevronLeft size={14} />
                </button>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{MONTHS[month]} {year}</span>
                <button onClick={() => setCurrent(new Date(year, month + 1))} style={{ background: "var(--surface-hover)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-muted)", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <ChevronRight size={14} />
                </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 6 }}>
                {DAYS.map(d => <div key={d} style={{ fontSize: 10, fontWeight: 500, color: "var(--text-muted)", textAlign: "center", padding: "2px 0", textTransform: "uppercase" }}>{d}</div>)}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                {cells.map((d, i) => (
                    <button key={i} onClick={() => d && onDateSelect?.(new Date(year, month, d))} disabled={!d}
                        style={{
                            height: 32, width: "100%", borderRadius: "var(--radius-sm)", border: "none", cursor: d ? "pointer" : "default",
                            background: isSelected(d) ? "var(--accent)" : isToday(d) ? "var(--surface-hover)" : "transparent",
                            color: isSelected(d) ? "white" : isToday(d) ? "var(--text-primary)" : d ? "var(--text-secondary)" : "transparent",
                            fontWeight: isSelected(d) || isToday(d) ? 600 : 400, fontSize: 12, position: "relative",
                            transition: "background 0.12s"
                        }}
                        onMouseEnter={e => { if (d && !isSelected(d)) e.currentTarget.style.background = "var(--surface-hover)"; }}
                        onMouseLeave={e => { if (d && !isSelected(d)) e.currentTarget.style.background = "transparent"; }}
                    >
                        {d || ""}
                        {d && hasEvent?.(new Date(year, month, d)) && (
                            <span style={{ position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: isSelected(d) ? "white" : "var(--accent)" }} />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};
export default Calendar;

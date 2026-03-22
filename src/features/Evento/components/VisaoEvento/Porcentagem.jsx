import React from "react";
export const Porcentagem = ({ valor = 0, label = "Concluído" }) => (
    <div className="surface-card h-48 flex flex-col items-center justify-between p-4">
        <p className="text-xs text-[var(--text-muted)] text-center leading-tight">{label}</p>
        <div className="relative w-24 h-24 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--accent)" strokeWidth="2.5"
                    strokeDasharray={`${valor}, 100`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.5s" }} />
            </svg>
            <span className="absolute text-base font-bold text-[var(--text-primary)]">{valor}%</span>
        </div>
        <div className="w-full bg-[var(--border)] rounded-full h-1.5">
            <div className="bg-[var(--accent)] h-1.5 rounded-full transition-all" style={{ width: `${valor}%` }} />
        </div>
    </div>
);

import React from "react";

export const DiaInfoCard = ({ info = "29-10-2025, São Paulo → São Paulo" }) => {
  return (
    <div className="flex flex-col justify-center min-h-11 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
      <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Dia do Show</p>
      <p className="text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">{info}</p>
    </div>
  );
};

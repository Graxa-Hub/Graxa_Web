import React from "react";

export const Porcentagem = ({ percent = 0 }) => {
  const clamped = Math.max(0, Math.min(100, Number(percent)));
  return (
    <div className="h-48 flex flex-col items-center justify-between bg-transparent p-4">
      <p className="text-sm text-[var(--text-secondary)] mb-2 text-center leading-tight">
        Progresso do cronograma: <br />
        % Realizada
      </p>
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" stroke="var(--border)" strokeWidth="10" fill="none" />
          <circle
            cx="60"
            cy="60"
            r="54"
            stroke="var(--accent)"
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${(clamped / 100) * (2 * Math.PI * 54)} ${2 * Math.PI * 54}`}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute text-lg font-bold text-[var(--text-primary)]">{clamped}%</span>
      </div>
    </div>
  );
};

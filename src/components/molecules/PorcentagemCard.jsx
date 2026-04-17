export const PorcentagemCard = ({ value = 0, valor, label = "Concluido" }) => {
  const progresso = value ?? valor ?? 0;

  return (
    <div className="flex h-48 flex-col items-center justify-between p-4 surface-card">
      <p className="text-center text-xs leading-tight text-[var(--text-muted)]">
        {label}
      </p>

      <div className="relative flex h-24 w-24 items-center justify-center">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="var(--border)"
            strokeWidth="2.5"
          />
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeDasharray={`${progresso}, 100`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.5s" }}
          />
        </svg>
        <span className="absolute text-base font-bold text-[var(--text-primary)]">
          {progresso}%
        </span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-[var(--border)]">
        <div
          className="h-1.5 rounded-full bg-[var(--accent)] transition-all"
          style={{ width: `${progresso}%` }}
        />
      </div>
    </div>
  );
};

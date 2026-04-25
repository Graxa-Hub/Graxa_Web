export const DiaInfoCard = ({ label = "Data", value, info }) => {
  const infoExibida = value ?? info ?? "Sem data";

  return (
    <div className="flex h-14 min-w-[130px] flex-col justify-center surface-card px-3 py-1">
      <p className="text-xs uppercase tracking-wide text-[var(--text-muted)]">
        {label}
      </p>
      <p className="whitespace-nowrap text-sm font-medium text-[var(--text-primary)]">
        {infoExibida}
      </p>
    </div>
  );
};

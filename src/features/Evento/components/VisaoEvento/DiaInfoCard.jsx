export const DiaInfoCard = ({ label = "Data", value, info }) => {
  const infoExibida = value ?? info ?? "Sem data";

  return (
    <div className="flex flex-col justify-center h-14 surface-card px-3 py-1 min-w-[130px]">
      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
        {infoExibida}
      </p>
    </div>
  );
};

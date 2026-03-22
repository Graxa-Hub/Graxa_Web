export const DiaInfoCard = ({ label, value }) => (
    <div className="flex flex-col justify-center h-14 surface-card px-3 py-1">
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">{value}</p>
    </div>
);

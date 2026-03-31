export const AuthHeader = ({ title, description }) => {
  return (
    <div className="text-[var(--text-primary)]">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-[var(--text-muted)]">{description}</p>
    </div>
  );
};

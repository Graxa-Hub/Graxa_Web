export function TurneError({ error }) {
  return (
    <div
      className="mx-6 mt-4 p-4 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-hover)]"
      style={{
        borderColor: "rgba(200,80,60,0.35)",
        background: "rgba(200,80,60,0.08)",
        color: "var(--accent)",
      }}
    >
      {error}
    </div>
  );
}

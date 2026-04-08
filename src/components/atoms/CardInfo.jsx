import { Users } from "lucide-react";

export const CardInfo = ({ nome, genero, integrantes }) => (
  <div className="p-4">
    <h3 className="font-bold text-[var(--text-primary)] text-base truncate mb-1">
      {nome}
    </h3>
    {genero && (
      <span className="inline-block px-2 py-0.5 text-xs font-medium bg-[var(--surface-hover)] text-[var(--text-secondary)] rounded-[var(--radius-sm)] border border-[var(--border)] mb-2">
        {genero}
      </span>
    )}
    {integrantes !== undefined && (
      <div className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
        <Users size={13} />
        <span>
          {integrantes} integrante{integrantes !== 1 ? "s" : ""}
        </span>
      </div>
    )}
  </div>
);

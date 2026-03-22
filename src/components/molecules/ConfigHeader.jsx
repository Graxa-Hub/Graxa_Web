import { Settings } from "lucide-react";

export const ConfigHeader = () => {
  return (
    <div className="border-b border-[var(--border)] pb-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
        <Settings size={18} className="text-[var(--text-secondary)]" />
      </div>
      <div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">Configurações do Usuário</h1>
        <p className="text-sm text-[var(--text-muted)]">Atualize seus dados e preferências visuais.</p>
      </div>
    </div>
  );
};

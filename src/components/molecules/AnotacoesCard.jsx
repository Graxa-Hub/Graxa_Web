import { FileText } from "lucide-react";

export const AnotacoesCard = ({
  title,
  titulo,
  content,
  conteudo,
  descricao,
}) => {
  const tituloExibido = title || titulo || "Anotacoes";
  const conteudoExibido = content ?? conteudo ?? descricao ?? "Sem anotacoes.";

  return (
    <div className="flex h-full flex-col overflow-hidden p-4 surface-card">
      <div className="mb-3 flex items-center gap-2 border-b border-[var(--border)] pb-3">
        <FileText className="h-4 w-4 text-[var(--text-secondary)]" />
        <h3 className="truncate text-sm font-semibold text-[var(--text-primary)]">
          {tituloExibido}
        </h3>
      </div>

      <div className="w-full flex-1 overflow-y-auto">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
          {conteudoExibido}
        </p>
      </div>
    </div>
  );
};

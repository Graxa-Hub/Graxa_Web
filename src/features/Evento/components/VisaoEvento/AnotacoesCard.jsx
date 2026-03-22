import React from "react";
import { FileText } from "lucide-react";

export const AnotacoesCard = ({ titulo, descricao }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border)] flex-shrink-0">
        <FileText className="w-5 h-5 text-[var(--accent)]" />
        <h3 className="font-semibold text-[var(--text-primary)] text-sm truncate">{titulo}</h3>
      </div>

      <div className="flex-1 w-full p-4 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)] overflow-y-auto">
        <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
          {descricao || "Nenhuma observação cadastrada."}
        </p>
      </div>
    </div>
  );
};

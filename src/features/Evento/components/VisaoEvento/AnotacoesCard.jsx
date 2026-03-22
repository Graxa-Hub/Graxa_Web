import { FileText } from "lucide-react";
export const AnotacoesCard = ({ titulo, conteudo }) => (
    <div className="surface-card h-full flex flex-col overflow-hidden p-4">
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--border)]">
            <FileText className="w-4 h-4 text-[var(--text-secondary)]" />
            <h3 className="font-semibold text-[var(--text-primary)] text-sm truncate">{titulo}</h3>
        </div>
        <div className="flex-1 w-full overflow-y-auto">
            <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">{conteudo || "Sem anotações."}</p>
        </div>
    </div>
);

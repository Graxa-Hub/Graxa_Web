import { Edit2, FileDown } from "lucide-react";
import { useRole } from "../../hooks/useRole";
import { DiaInfoCard } from "../atoms/DiaInfoCard";

export const EventActions = ({
  tipoEvento,
  dataInfo,
  onGerarPdf,
  onEditarEvento,
}) => {
  const { isProducer } = useRole();

  return (
    <div className="ml-auto flex items-center gap-4 pr-16 lg:pr-20">
      <button
        onClick={onGerarPdf}
        disabled={tipoEvento !== "show"}
        className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:bg-[var(--surface-hover)] disabled:text-[var(--text-muted)]"
        title={
          tipoEvento !== "show"
            ? "PDF disponivel apenas para Shows"
            : "Ver Relatorio do Evento"
        }
      >
        <FileDown size={16} />
        Ver Relatorio
      </button>

      {isProducer() && (
        <button
          onClick={onEditarEvento}
          className="flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--surface-elevated)] px-5 py-2.5 text-sm font-semibold text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--surface-hover)]"
        >
          <Edit2 size={16} />
          Editar Evento
        </button>
      )}

      <DiaInfoCard label="Data" value={dataInfo} />
    </div>
  );
};

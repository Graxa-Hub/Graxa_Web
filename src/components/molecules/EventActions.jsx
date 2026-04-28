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
    <div className="flex flex-row items-center gap-2 sm:ml-auto">
      <button
        onClick={onGerarPdf}
        disabled={tipoEvento !== "show"}
        className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--surface-hover)] disabled:cursor-not-allowed disabled:bg-[var(--surface-hover)] disabled:text-[var(--text-muted)]"
        title={
          tipoEvento !== "show"
            ? "PDF disponivel apenas para Shows"
            : "Ver Relatorio do Evento"
        }
      >
        <FileDown size={20} />
      </button>

      <button
        onClick={onEditarEvento}
        className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--surface-hover)]"
        title="Editar Evento"
      >
        <Edit2 size={20} />
      </button>

      <DiaInfoCard label="Data" value={dataInfo} />
    </div>
  );
};

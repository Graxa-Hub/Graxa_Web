import { MapPin } from "lucide-react";
import { EventActions } from "../molecules/EventActions";

export const EventHeader = ({
  nomeEvento,
  nomeLocal,
  dataInfo,
  tipoEvento,
  onGerarPdf,
  onEditarEvento,
}) => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="panel-title">{nomeEvento}</h1>
        <div className="mt-1 flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-secondary)]">{nomeLocal}</p>
        </div>
      </div>

      <EventActions
        tipoEvento={tipoEvento}
        dataInfo={dataInfo}
        onGerarPdf={onGerarPdf}
        onEditarEvento={onEditarEvento}
      />
    </div>
  );
};

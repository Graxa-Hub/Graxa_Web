import React from "react";
import { useNavigate } from "react-router-dom";

export function TaskList({ eventos = [] }) {
  const navigate = useNavigate();
  const agora = new Date();

  const eventosFuturos = [...eventos]
    .filter((evento) => {
      const dataEvento = new Date(evento.start);
      return dataEvento > agora;
    })
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  const formatarDataHora = (dataStr) => {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEventoClick = (evento) => {
    const tipoEvento = evento.type === "show" ? "show" : "viagem";
    const idNumerico = evento.id.split("-").pop();
    navigate(`/visao-evento/${tipoEvento}/${idNumerico}`);
  };

  return (
    <div className="w-full overflow-auto p-4">
      <h1 className="text-center text-[var(--text-primary)] font-semibold mb-4">
        Proximos Eventos ({eventosFuturos.length})
      </h1>

      {eventosFuturos.length === 0 ? (
        <p className="text-center text-[var(--text-muted)] text-sm">
          Nenhum evento agendado
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {eventosFuturos.map((evento, index) => (
            <li
              key={evento.id || index}
              onClick={() => handleEventoClick(evento)}
              className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-3 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors"
            >
              <div
                className={`h-3 w-3 rounded-full flex-shrink-0 mt-1 ${
                  evento.type === "show"
                    ? "bg-[var(--accent)]"
                    : "bg-[var(--info)]"
                }`}
              ></div>
              <div className="flex flex-col flex-1 min-w-0">
                <h2 className="text-xs text-[var(--text-muted)]">
                  {formatarDataHora(evento.start)}
                  {evento.end && ` - ${formatarDataHora(evento.end)}`}
                </h2>
                <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                  {evento.title || "Sem titulo"}
                </p>
                <span
                  className={`text-xs ${
                    evento.type === "show"
                      ? "text-[var(--accent)]"
                      : "text-[var(--info)]"
                  }`}
                >
                  {evento.type === "show" ? "Show" : "Viagem"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";

export function TaskList({ eventos = [] }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
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

  const calcularTempoRestante = (dataStr) => {
    if (!dataStr) return "";
    const dataEvento = new Date(dataStr);
    const diffEmMs = dataEvento - agora;
    const diffEmDias = Math.floor(diffEmMs / (1000 * 60 * 60 * 24));
    
    if (diffEmDias === 0) return "Hoje";
    if (diffEmDias === 1) return "Amanhã";
    if (diffEmDias < 30) return `Daqui a ${diffEmDias} dias`;
    
    const diffEmMeses = Math.floor(diffEmDias / 30);
    if (diffEmMeses < 12) {
      return `Daqui a ${diffEmMeses} ${diffEmMeses === 1 ? "mês" : "meses"}`;
    }
    
    const diffEmAnos = Math.floor(diffEmMeses / 12);
    return `Daqui a ${diffEmAnos} ${diffEmAnos === 1 ? "ano" : "anos"}`;
  };

  const handleEventoClick = (evento) => {
    const tipoEvento = evento.type === "show" ? "show" : "viagem";
    const idNumerico = evento.id.split("-").pop();
    navigate(`/visao-evento/${tipoEvento}/${idNumerico}`);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div 
        className={`surface-card w-full flex flex-col overflow-hidden transition-all duration-300 ease-in-out shadow-[0_-4px_20px_rgba(0,0,0,0.15)] ${
          isExpanded 
            ? "fixed bottom-0 left-0 z-50 h-[90vh] rounded-t-2xl lg:relative lg:h-full lg:z-auto lg:rounded-t-lg lg:border-t lg:border-[var(--border)]" 
            : "relative h-[48px] rounded-t-lg border-t border-[var(--border)]"
        }`}
      >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full h-[48px] flex items-center justify-between px-4 text-[var(--text-primary)] font-semibold text-sm flex-shrink-0 bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer border-b border-transparent data-[expanded=true]:border-[var(--border)]"
        data-expanded={isExpanded}
      >
        <span>Próximos Eventos ({eventosFuturos.length})</span>
        {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </button>

      <div className="flex-1 overflow-y-auto p-3">
        {eventosFuturos.length === 0 ? (
          <p className="text-center text-[var(--text-muted)] text-sm mt-4">
            Nenhum evento agendado
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {eventosFuturos.map((evento, index) => (
              <li
                key={evento.id || index}
                onClick={() => handleEventoClick(evento)}
                className="flex items-start gap-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] p-3 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors flex-shrink-0 relative"
              >
                <div
                  className={`h-3 w-3 rounded-full flex-shrink-0 mt-1 ${
                    evento.type === "show"
                      ? "bg-[var(--accent)]"
                      : "bg-[var(--info)]"
                  }`}
                ></div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h2 className="text-xs text-[var(--text-muted)]">
                      {formatarDataHora(evento.start)}
                      {evento.end && ` - ${formatarDataHora(evento.end)}`}
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-hover)] text-[var(--text-secondary)] border border-[var(--border)]">
                      {calcularTempoRestante(evento.start)}
                    </span>
                  </div>
                  <p className="font-medium text-sm text-[var(--text-primary)] truncate">
                    {evento.title || "Sem titulo"}
                  </p>

                  {/* Exibe banda e turne se disponíveis */}
                  {(evento.extendedProps?.banda || evento.extendedProps?.turne) && (
                    <div className="text-xs text-[var(--text-muted)] mt-1 space-y-0.5">
                      {evento.extendedProps.banda?.nome && (
                        <div>🎵 {evento.extendedProps.banda.nome}</div>
                      )}
                      {evento.extendedProps.turne?.nome && (
                        <div>🎪 {evento.extendedProps.turne.nome}</div>
                      )}
                    </div>
                  )}

                  <span
                    className={`text-xs ${
                      evento.type === "show"
                        ? "text-[var(--accent)]"
                        : "text-[var(--info)]"
                    } mt-1`}
                  >
                    {evento.type === "show" ? "Show" : "Viagem"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </>
  );
}

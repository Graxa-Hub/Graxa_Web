import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptLocale from "@fullcalendar/core/locales/pt";
import "@fullcalendar/common/main.css";
import "../../index.css";
import { EventoModal } from "../EventoModal";
import { useEventosCalendario } from "../../hooks/useEventosCalendario";

export default function MainCalendar({
  onCalendarApi,
  onEventosChange,
  bandaId, // ✅ Novo prop
  turneId, // ✅ Novo prop
}) {
  const calendarRef = useRef(null);
  const navigate = useNavigate();

  const { eventos, loading, carregarEventos, adicionarEventoLocal } =
    useEventosCalendario();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [dataHoraSelecionada, setDataHoraSelecionada] = useState({
    inicio: "",
    fim: "",
  });

  // ✅ Recarrega eventos quando filtros mudarem
  useEffect(() => {
    console.log("[MainCalendar] Filtros mudaram:", { bandaId, turneId });
    carregarEventos({ bandaId, turneId });
  }, [bandaId, turneId, carregarEventos]);

  // Expõe API do calendário se necessário
  useEffect(() => {
    if (calendarRef.current && typeof onCalendarApi === "function") {
      try {
        onCalendarApi(calendarRef.current.getApi());
      } catch (e) {
        // ignore if getApi isn't available yet
      }
    }
  }, [onCalendarApi]);

  // Compartilha eventos com SideCalendar
  useEffect(() => {
    if (typeof onEventosChange === "function") {
      onEventosChange(eventos);
    }
  }, [eventos, onEventosChange]);

  const handleDateSelect = (selectInfo) => {
    // Formata data/hora para o formato datetime-local (YYYY-MM-DDTHH:mm)
    const formatarParaDateTimeLocal = (data) => {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const dia = String(data.getDate()).padStart(2, "0");
      const hora = String(data.getHours()).padStart(2, "0");
      const minuto = String(data.getMinutes()).padStart(2, "0");
      return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
    };

    const inicio = formatarParaDateTimeLocal(selectInfo.start);
    const fim = formatarParaDateTimeLocal(selectInfo.end);

    console.log("[MainCalendar] Data/Hora selecionada:", { inicio, fim });

    setDataHoraSelecionada({ inicio, fim });

    try {
      selectInfo.view.calendar.unselect();
    } catch {}

    setCreateModalOpen(true);
  };

  const handleEventClick = () => {
    navigate("/visao-evento");
  };

  return (
    <div className="graxa-calendar-card bg-white rounded-lg shadow p-4 h-full min-h-0 flex flex-col">
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
          <p className="text-gray-600">Carregando eventos...</p>
        </div>
      )}
      <FullCalendar
        className="graxa-calendar"
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale={ptLocale}
        initialView="timeGridWeek"
        aspectRatio={1.35}
        headerToolbar={{
          left: "prev,today,next",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        selectable={true}
        select={handleDateSelect}
        events={eventos}
        eventClick={handleEventClick}
        editable={true}
        dayMaxEvents={3}
        allDaySlot={false}
        height="100%"
      />
      <EventoModal
        isOpen={createModalOpen}
        dataHoraInicial={dataHoraSelecionada}
        turneId={turneId} // ✅ Passa turnê pré-selecionada
        onClose={() => {
          setCreateModalOpen(false);
          setDataHoraSelecionada({ inicio: "", fim: "" });
        }}
        onFinish={(entidadeCriada) => {
          console.log("[MainCalendar] Evento criado:", entidadeCriada);

          // Determina tipo (show ou viagem) pela estrutura dos dados
          const tipo = entidadeCriada?.tipoViagem ? "viagem" : "show";
          console.log("[MainCalendar] Tipo de evento:", tipo);

          // Adiciona evento localmente para feedback imediato
          adicionarEventoLocal(entidadeCriada, tipo);

          setCreateModalOpen(false);
          setDataHoraSelecionada({ inicio: "", fim: "" });

          // Recarrega eventos do backend após 500ms
          setTimeout(() => {
            console.log("[MainCalendar] Recarregando eventos do backend...");
            carregarEventos({ bandaId, turneId });
          }, 500);
        }}
      />
    </div>
  );
}

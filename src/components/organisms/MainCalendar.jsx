import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptLocale from "@fullcalendar/core/locales/pt";
import "../../index.css";
import { EventoModal } from "../features/event/organisms/EventoModal";
import { useEventosCalendario } from "../../hooks/useEventosCalendario";

export default function MainCalendar({
  onCalendarApi,
  onEventosChange,
  bandaId,
  turneId,
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

  useEffect(() => {
    carregarEventos({ bandaId, turneId });
  }, [bandaId, turneId, carregarEventos]);

  useEffect(() => {
    if (calendarRef.current && typeof onCalendarApi === "function") {
      try {
        onCalendarApi(calendarRef.current.getApi());
      } catch {
        // noop
      }
    }
  }, [onCalendarApi]);

  useEffect(() => {
    if (typeof onEventosChange === "function") onEventosChange(eventos);
  }, [eventos, onEventosChange]);

  const handleDateSelect = (selectInfo) => {
    const formatarParaDateTimeLocal = (data) => {
      const ano = data.getFullYear();
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const dia = String(data.getDate()).padStart(2, "0");
      const hora = String(data.getHours()).padStart(2, "0");
      const minuto = String(data.getMinutes()).padStart(2, "0");
      return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
    };

    setDataHoraSelecionada({
      inicio: formatarParaDateTimeLocal(selectInfo.start),
      fim: formatarParaDateTimeLocal(selectInfo.end),
    });

    try {
      selectInfo.view.calendar.unselect();
    } catch {
      // noop
    }

    setCreateModalOpen(true);
  };

  const handleEventClick = (selectInfo) => {
    const eventoId =
      selectInfo.event?.extendedProps?.dados?.id || selectInfo.event?.id;
    const tipoEvento = selectInfo.event?.extendedProps?.tipo || "show";
    if (eventoId) navigate(`/visao-evento/${tipoEvento}/${eventoId}`);
  };

  return (
    <div className="graxa-calendar-card surface-card p-4 h-full min-h-0 flex flex-col relative overflow-hidden">
      {loading && (
        <div className="absolute inset-0 bg-[color:var(--overlay)]/30 flex items-center justify-center rounded-[var(--radius-md)] z-10">
          <p className="text-[var(--text-primary)]">Carregando eventos...</p>
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
          right: "dayGridMonth,timeGridWeek",
        }}
        selectable
        select={handleDateSelect}
        events={eventos}
        eventClick={handleEventClick}
        editable
        dayMaxEvents={3}
        allDaySlot={false}
        height="100%"
      />
      <EventoModal
        isOpen={createModalOpen}
        dataHoraInicial={dataHoraSelecionada}
        turneId={turneId}
        bandaId={bandaId}
        onClose={() => {
          setCreateModalOpen(false);
          setDataHoraSelecionada({ inicio: "", fim: "" });
        }}
        onFinish={(entidadeCriada) => {
          const tipo = entidadeCriada?.tipoViagem ? "viagem" : "show";
          adicionarEventoLocal(entidadeCriada, tipo);
          setCreateModalOpen(false);
          setDataHoraSelecionada({ inicio: "", fim: "" });
          setTimeout(() => carregarEventos({ bandaId, turneId }), 500);
        }}
      />
    </div>
  );
}

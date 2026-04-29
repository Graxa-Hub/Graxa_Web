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
  const [errorToast, setErrorToast] = useState("");
  const [dataHoraSelecionada, setDataHoraSelecionada] = useState({
    inicio: "",
    fim: "",
  });

  useEffect(() => {
    console.log("📡 MainCalendar chamando carregarEventos com:", { bandaId, turneId });
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
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataSelecionada = new Date(selectInfo.start);
    dataSelecionada.setHours(0, 0, 0, 0);

    if (dataSelecionada < hoje) {
      setErrorToast("Não é permitido criar eventos em datas passadas.");
      setTimeout(() => setErrorToast(""), 3000);
      try {
        selectInfo.view.calendar.unselect();
      } catch {
        // noop
      }
      return;
    }

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

  const handleDatesSet = (arg) => {
    localStorage.setItem("graxaCalendarView", arg.view.type);
  };

  const savedView = localStorage.getItem("graxaCalendarView") || "timeGridWeek";

  return (
    <div className="graxa-calendar-card surface-card p-4 h-full min-h-0 flex flex-col relative overflow-hidden">
      {errorToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[color:var(--surface-elevated)] border border-[color:var(--accent)] text-[color:var(--accent)] px-4 py-2 rounded-[color:var(--radius-sm)] shadow-[color:var(--shadow-card)] z-20 flex items-center gap-2 font-medium text-sm animate-fade-in">
          ⚠️ {errorToast}
        </div>
      )}
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
        initialView={savedView}
        datesSet={handleDatesSet}
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

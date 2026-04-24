import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ptLocale from "@fullcalendar/core/locales/pt";
import { useEventosCalendario } from "../../hooks/useEventosCalendario";

export default function SideCalendar({ mainCalendarApi }) {
  const { eventos: todosEventos, carregarEventos } = useEventosCalendario();
  const navigate = useNavigate();

  // Carrega TODOS os eventos sem filtro
  useEffect(() => {
    carregarEventos({});
  }, [carregarEventos]);

  const handleDateClick = (arg) => {
    if (mainCalendarApi && typeof mainCalendarApi.gotoDate === "function") {
      try {
        mainCalendarApi.changeView("timeGridWeek");
        mainCalendarApi.gotoDate(arg.date);
      } catch (e) {
        // ignore
      }
    }
  };

  const handleEventClick = (info) => {
    const tipo = info.event.extendedProps?.tipo || "show";
    const eventoId = info.event.extendedProps?.dados?.id || info.event.id;
    if (eventoId) {
      navigate(`/visao-evento/${tipo}/${eventoId}`);
    }
  };

  const eventosDots = todosEventos.map((evento) => ({
    id: evento.id,
    title: evento.title || "Evento",
    start: evento.start,
    end: evento.end,
    backgroundColor: evento.type === "show" ? "#ef4444" : "#3b82f6",
    borderColor: evento.type === "show" ? "#ef4444" : "#3b82f6",
    display: "block",
    extendedProps: evento.extendedProps || { tipo: evento.type },
  }));

  return (
    <div className="mini-calendar rounded-lg h-full">
      <FullCalendar
        locale={ptLocale}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{ left: "", center: "title", right: "" }}
        dayHeaderFormat={{ weekday: "narrow" }}
        fixedWeekCount={false}
        height="100%"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={eventosDots}
        displayEventTime={false}
        dayMaxEvents={2}
        eventContent={() => ({
          html: '<div style="width: 6px; height: 6px; border-radius: 50%; margin: 2px auto;"></div>',
        })}
      />
    </div>
  );
}

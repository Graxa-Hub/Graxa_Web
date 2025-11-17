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

export default function MainCalendar({ onCalendarApi }) {
  // helper to ensure a date string includes a time portion (so events appear in timeGrid views)
  const ensureHasTime = (isoStr, defaultTime = "09:00:00") => {
    if (!isoStr) return isoStr;
    return isoStr.includes("T") ? isoStr : `${isoStr}T${defaultTime}`;
  };

  const calendarRef = useRef(null);

  useEffect(() => {
    if (calendarRef.current && typeof onCalendarApi === "function") {
      try {
        onCalendarApi(calendarRef.current.getApi());
      } catch (e) {
        // ignore if getApi isn't available yet
      }
    }
  }, [onCalendarApi]);

  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Evento inicial",
      // make this an event with a time so it appears in timeGrid and is clickable
      start: ensureHasTime(new Date().toISOString().slice(0, 10), "10:00:00"),
    },
  ]);

  const handleDateSelect = (selectInfo) => {
    const title = window.prompt("Título do evento:");
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();
    if (title) {
      // ensure new events have a time if the selection is an all-day date
      const start = ensureHasTime(selectInfo.startStr);
      const end = ensureHasTime(selectInfo.endStr);
      setEvents((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          start,
          end,
          allDay: selectInfo.allDay,
        },
      ]);
    }
  };

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [lastSelectInfo, setLastSelectInfo] = useState(null);

  const navigate = useNavigate();

  const handleEventClick = () => {
    navigate("/visao-evento");
  };

  return (
    <div className="graxa-calendar-card bg-white rounded-lg shadow p-4 h-full min-h-0 flex flex-col">
      {/*
          Use slotMinTime/slotMaxTime to limit visible hours (reduces vertical length)
          and set height="100%" so FullCalendar fills the parent container. The
          parent (`Main.jsx`) already provides a flex-1 + overflow-auto area, so
          the calendar will scroll internally when needed.
        */}
      <FullCalendar
        className="graxa-calendar"
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale={ptLocale}
        initialView="timeGridWeek"
        /* make calendar slightly less tall by increasing aspect ratio (width/height) */
        aspectRatio={1.35}
        headerToolbar={{
          left: "prev,today,next",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        selectable={true}
        select={(selectInfo) => {
          setLastSelectInfo(selectInfo);
          // remove highlight immediately para evitar confusão visual
          try {
            selectInfo.view.calendar.unselect();
          } catch {}
          setCreateModalOpen(true);
        }}
        events={events}
        eventClick={handleEventClick}
        editable={true}
        dayMaxEvents={3}
        /* remove the all-day slot at the top of timeGrid views */
        allDaySlot={false}
        /* Let FullCalendar fill the parent container so the calendar keeps
        a proportional height relative to the screen. The container is a
        flex column with min-height:0 so child can shrink; the CSS below
        ensures the internal scroller handles overflow. */
        height="100%"
      />
      <EventoModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setLastSelectInfo(null);
        }}
        onFinish={(entidadeCriada) => {
          // Mapeia entidade (show/viagem) para um evento do calendário
          const title =
            entidadeCriada?.nomeEvento || entidadeCriada?.titulo || "Evento";
          const startRaw =
            entidadeCriada?.dataInicio ||
            entidadeCriada?.dataHoraInicio ||
            entidadeCriada?.start;
          const endRaw =
            entidadeCriada?.dataFim ||
            entidadeCriada?.dataHoraFim ||
            entidadeCriada?.end ||
            startRaw;
          const start = ensureHasTime(startRaw);
          const end = ensureHasTime(endRaw);
          setEvents((prev) => [
            ...prev,
            {
              id: String(entidadeCriada?.id ?? Date.now()),
              title,
              start,
              end,
            },
          ]);
          setCreateModalOpen(false);
          setLastSelectInfo(null);
        }}
      />
    </div>
  );
}

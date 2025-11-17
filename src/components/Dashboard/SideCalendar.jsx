import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ptLocale from "@fullcalendar/core/locales/pt";

export default function SideCalendar({ mainCalendarApi, eventos = [] }) {
  const handleDateClick = (arg) => {
    // when a day is clicked in the mini calendar, navigate main calendar to that date
    if (mainCalendarApi && typeof mainCalendarApi.gotoDate === "function") {
      try {
        mainCalendarApi.changeView("timeGridDay");
        mainCalendarApi.gotoDate(arg.date);
      } catch (e) {
        // ignore
      }
    }
  };

  // Transforma eventos em dots (apenas bolinhas)
  const eventosDots = eventos.map((evento) => ({
    id: evento.id,
    title: "•", // Apenas bolinha
    start: evento.start, // Data completa com hora
    end: evento.end, // Data de término (para eventos de múltiplos dias)
    backgroundColor: evento.type === "show" ? "#ef4444" : "#3b82f6",
    borderColor: evento.type === "show" ? "#ef4444" : "#3b82f6",
    display: "block",
  }));

  return (
    <div className="mini-calendar rounded-lg">
      <FullCalendar
        locale={ptLocale}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        /* show the month title above the calendar */
        headerToolbar={{ left: "", center: "title", right: "" }}
        /* use narrow weekday names (single-letter) */
        dayHeaderFormat={{ weekday: "narrow" }}
        /* increase aspectRatio so month cells become visually closer to squares (7 cols / ~5 rows -> ~1.6) */
        aspectRatio={1}
        dateClick={handleDateClick}
        events={eventosDots}
        displayEventTime={false}
        dayMaxEvents={false}
        eventContent={() => {
          return { html: '<div style="width: 6px; height: 6px; border-radius: 50%; margin: 2px auto;"></div>' };
        }}
      />
    </div>
  );
}

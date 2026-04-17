import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ptLocale from "@fullcalendar/core/locales/pt";

export default function SideCalendar({ mainCalendarApi, eventos = [] }) {
  const handleDateClick = (arg) => {
    if (mainCalendarApi && typeof mainCalendarApi.gotoDate === "function") {
      try {
        mainCalendarApi.changeView("timeGridDay");
        mainCalendarApi.gotoDate(arg.date);
      } catch (e) {
        // ignore
      }
    }
  };

  const eventosDots = eventos.map((evento) => ({
    id: evento.id,
    title: "•",
    start: evento.start,
    end: evento.end,
    backgroundColor: evento.type === "show" ? "#ef4444" : "#3b82f6",
    borderColor: evento.type === "show" ? "#ef4444" : "#3b82f6",
    display: "block",
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
        events={eventosDots}
        displayEventTime={false}
        dayMaxEvents={false}
        eventContent={() => {
          return {
            html: '<div style="width: 6px; height: 6px; border-radius: 50%; margin: 2px auto;"></div>',
          };
        }}
      />
    </div>
  );
}

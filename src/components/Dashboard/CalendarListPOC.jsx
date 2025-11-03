import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import ptLocale from "@fullcalendar/core/locales/pt";

export default function CalendarListPOC({ mainCalendarApi }) {
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

  return (
    <div className="p-5 mini-calendar rounded-lg">
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
      />
    </div>
  );
}

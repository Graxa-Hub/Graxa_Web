import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

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
    <div className="p-5 mini-calendar bg-white rounded-lg">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        /* increase aspectRatio so month cells become visually closer to squares (7 cols / ~5 rows -> ~1.6) */
        aspectRatio={1}
        dateClick={handleDateClick}
      />
    </div>
  );
}

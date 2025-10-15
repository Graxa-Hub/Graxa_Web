import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const Calendar = () => {
  return (
    <FullCalendar
      height={550}
      width={600}
      eventColor="#FF5300"
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={[
        { title: "The Town", start: "2025-10-15", end: "2025-10-19" },
        { title: "Evento 2", date: "2025-10-20" },
      ]}
    />
  );
};

export default Calendar;

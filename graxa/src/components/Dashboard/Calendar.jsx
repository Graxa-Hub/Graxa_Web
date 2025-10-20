import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

export const Calendar = () => {
  const calendarRef = useRef(null);

  return (
    <div className="w-full max-w-[860px] md:max-w-[920px] lg:max-w-[980px] mx-auto">
      <FullCalendar
        height={500}
        width={500}
        eventColor="#FF5300"
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        ref={calendarRef}
        customButtons={{
          prevMonth: {
            text: "<",
            click: () => calendarRef.current?.getApi().prev(),
          },
          nextMonth: {
            text: ">",
            click: () => calendarRef.current?.getApi().next(),
          },
          adicionar: {
            text: "Adicionar",
            click: () => {
              alert("Oi");
            },
          },
        }}
        // Posições dos botões:
        headerToolbar={{
          // Extrema esquerda
          start: "adicionar",
          // Centro
          center: "title",
          // Extrema direita
          end: "prevMonth today nextMonth",
        }}
        events={[
          { title: "The Town", start: "2025-10-15", end: "2025-10-19" },
          { title: "Evento 2", date: "2025-10-20" },
        ]}
        eventClick={(info) => {
          const { title, start } = info.event;
          alert(`Título: ${title}\nTempo: ${start.toLocaleString()} `);
        }}
      />
    </div>
  );
};

export default Calendar;

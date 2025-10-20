import React from "react";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";

export const Lista = () => {
  return (
    <div className="w-70 min-h-0 rounded overflow-hidden">
      <FullCalendar
        plugins={[listPlugin]}
        // listWeek, listYear, listMonth
        initialView="listMonth"
        headerToolbar={false}
        locale={ptBrLocale}
        noEventsText="Sem eventos neste ano"
        // Semana abreviado, data com 2 dígitos
        listDayFormat={{ weekday: "short", day: "2-digit", month: "2-digit" }}
        listDaySideFormat={false}
        events={[
          {
            title: "Passagem de som",
            start: "2025-10-20T17:00:00",
            end: "2025-10-20T18:00:00",
          },
        ]}
        views={{
          // Se quiser o agrupamento por mês como no mock, troque initialView para 'listYear'
          listYear: {
            noEventsText: "Sem eventos neste ano",
          },
        }}
        eventClick={(info) => {
          const { title, start } = info.event;
          // alert(`Evento: ${title}\nInício: ${start.toLocaleString()}`);
          alert("Oi");
        }}
        height="100%"
      />
    </div>
  );
};

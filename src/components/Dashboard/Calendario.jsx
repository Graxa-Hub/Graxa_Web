import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import CalendarPOC from "./CalendarPOC";
import CalendarListPOC from "./CalendarListPOC";

export const Calendario = () => {
  const [mainCalendarApi, setMainCalendarApi] = useState(null);
  return (
    <main className="flex-1 flex flex-col p-5 bg-neutral-300 min-h-0">
      {/* Cabeçalho da main */}
      <header className="flex h-14 w-full mb-5">
        {/* Area */}
        <div className="flex justify-between items-center h-full max-w-70 w-full sm:w-1/3 px-4 bg-white rounded-lg">
          <div className="flex gap-3 items-center">
            {/* Bolinha Colorida */}
            <div className="h-8 w-8 bg-green-500 rounded-full"></div>

            {/* Textos - Informação */}
            <div>
              <h2 className="font-semibold">Boogarins</h2>
              <p className="text-neutral-700 text-sm">TURNE: BACURI</p>
            </div>
          </div>

          <div>
            <ChevronDown />
          </div>
        </div>
      </header>

      {/* Container  */}
      <div className="flex-1 w-full rounded-lg overflow-auto min-h-0">
        {/* Conteúdo do dashboard */}
        <div className="flex h-full justify-between cols cols-2 sm:cols-1 gap-3">
          {/* Calendário */}
          <div className="min-w-[72%] h-full">
            <CalendarPOC onCalendarApi={setMainCalendarApi} />
          </div>
          {/* Preview */}
          <div className="min-w-[27%] rounded-lg p-2 h-full">
            <CalendarListPOC mainCalendarApi={mainCalendarApi} />
          </div>
        </div>
      </div>
    </main>
  );
};

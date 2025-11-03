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
      <div className="flex-1 w-full rounded-lg overflow-auto min-h-0 ">
        {/* Conteúdo do dashboard */}
        <div className="flex h-full justify-between cols cols-2 sm:cols-1 gap-3">
          {/* Calendário */}
          <div className="min-w-[72%] h-full">
            <CalendarPOC onCalendarApi={setMainCalendarApi} />
          </div>
          {/* Preview */}
          <div className="min-w-[27%] rounded-lg p-2 h-full bg-white">
            <CalendarListPOC mainCalendarApi={mainCalendarApi} />
            {/* Lista embaixo do calendário */}
            <div className="w-full overflow-auto p-4">
              <ul className="flex flex-col gap-3">
                <h1 className="text-center text-blue-600">
                  Dias de evento registrado:
                </h1>
                <li className="flex items-center gap-5">
                  <div className="h-3 w-3  bg-red-400 rounded-full"></div>
                  <div className="flex flex-col">
                    {/* Horário */}
                    <h2 className="text-neutral-400">8:00 - 8:30 AM</h2>
                    <p>Monthly catch-up</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

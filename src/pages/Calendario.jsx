import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import MainCalendar from "../components/Dashboard/MainCalendar";
import SideCalendar from "../components/Dashboard/SideCalendar";
import { Header } from "../components/Dashboard/Header";
import { Container } from "../components/Dashboard/Container";
import { TaskList } from "../components/Dashboard/TaskList";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";

export const Calendario = () => {
  const [mainCalendarApi, setMainCalendarApi] = useState(null);
  const [eventos, setEventos] = useState([]);

  console.log("[Calendario] Eventos no estado:", eventos);

  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 flex flex-col p-5 bg-neutral-300 min-h-0">
        {/* Cabeçalho da main */}
        <Header
          titulo="Boogarins"
          turne="The Town 2025"
          circulo="bg-green-500"
        />

        {/* Container  */}
        <Container>
          <div className="min-w-[72%] h-full">
            <MainCalendar 
              onCalendarApi={setMainCalendarApi}
              onEventosChange={(novosEventos) => {
                console.log("[Calendario] onEventosChange chamado com:", novosEventos);
                setEventos(novosEventos);
              }}
            />
          </div>
          {/* Preview */}
          <div className="min-w-[27%] rounded-lg p-1 h-full bg-white flex flex-col">
            <SideCalendar 
              mainCalendarApi={mainCalendarApi}
              eventos={eventos}
            />
            {/* Lista embaixo do calendário */}
            <div className="flex-1 overflow-auto">
              <TaskList eventos={eventos} />
            </div>
          </div>
        </Container>
      </main>
    </Layout>
  );
};

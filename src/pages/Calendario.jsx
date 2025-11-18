import React, { useState, useEffect } from "react";
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
  
  // ✅ Estados para controlar filtros
  const [bandaSelecionada, setBandaSelecionada] = useState(null);
  const [turneSelecionada, setTurneSelecionada] = useState(null);

  console.log("[Calendario] Eventos no estado:", eventos);
  console.log("[Calendario] Banda selecionada:", bandaSelecionada);
  console.log("[Calendario] Turnê selecionada:", turneSelecionada);

  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 flex flex-col p-5 bg-neutral-300 min-h-0">
        {/* ✅ Header agora controla os filtros */}
        <Header
          circulo="bg-green-500"
          onBandaChange={(banda) => {
            console.log("[Calendario] Banda alterada:", banda);
            setBandaSelecionada(banda);
          }}
          onTurneChange={(turne) => {
            console.log("[Calendario] Turnê alterada:", turne);
            setTurneSelecionada(turne);
          }}
        />

        <Container>
          <div className="min-w-[72%] h-full">
            {/* ✅ Passa filtros para o calendário */}
            <MainCalendar 
              onCalendarApi={setMainCalendarApi}
              onEventosChange={(novosEventos) => {
                console.log("[Calendario] onEventosChange chamado com:", novosEventos);
                setEventos(novosEventos);
              }}
              bandaId={bandaSelecionada?.id}
              turneId={turneSelecionada?.id}
            />
          </div>
          
          <div className="min-w-[27%] rounded-lg p-1 h-full bg-white flex flex-col">
            <SideCalendar 
              mainCalendarApi={mainCalendarApi}
              eventos={eventos}
            />
            <div className="flex-1 overflow-auto">
              <TaskList eventos={eventos} />
            </div>
          </div>
        </Container>
      </main>
    </Layout>
  );
};

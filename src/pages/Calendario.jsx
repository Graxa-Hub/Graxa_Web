import React, { useState, useEffect } from "react";
import MainCalendar from "../components/Dashboard/MainCalendar";
import SideCalendar from "../components/Dashboard/SideCalendar";
import { Header } from "../components/Dashboard/Header";
import { Container } from "../components/Dashboard/Container";
import { TaskList } from "../components/Dashboard/TaskList";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { useSearchParams } from "react-router-dom";
import { useBandas } from "../hooks/useBandas";
import { useTurnes } from "../hooks/useTurnes"; // Supondo que exista esse hook

export const Calendario = () => {
  const [mainCalendarApi, setMainCalendarApi] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [bandaSelecionada, setBandaSelecionada] = useState(null);
  const [turneSelecionada, setTurneSelecionada] = useState(null);

  // Hooks para buscar bandas e turnes
  const { bandas, listarBandas } = useBandas();
  const { turnes, listarTurnes } = useTurnes();

  // Pegue os parâmetros da URL
  const [searchParams] = useSearchParams();
  const bandaIdParam = searchParams.get("bandaId");
  const turneIdParam = searchParams.get("turneId");

  // Carregue bandas e turnes ao montar
  useEffect(() => {
    listarBandas();
    listarTurnes();
  }, [listarBandas, listarTurnes]);

  // Quando os parâmetros mudarem ou bandas/turnes carregarem, selecione os objetos completos
  useEffect(() => {
    if (bandaIdParam && bandas.length > 0) {
      const banda = bandas.find(b => String(b.id) === String(bandaIdParam));
      setBandaSelecionada(banda || null);
    }
    if (turneIdParam && turnes.length > 0) {
      const turne = turnes.find(t => String(t.id) === String(turneIdParam));
      setTurneSelecionada(turne || null);
    }
  }, [bandaIdParam, turneIdParam, bandas, turnes]);

  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 flex flex-col p-5 bg-neutral-300 min-h-0">
        <Header
          circulo="bg-green-500"
          bandaSelecionada={bandaSelecionada}
          turneSelecionada={turneSelecionada}
          onBandaChange={setBandaSelecionada}
          onTurneChange={setTurneSelecionada}
          bandas={bandas}
          turnes={turnes}
        />

        <Container>
          <div className="min-w-[72%] h-full">
            <MainCalendar
              onCalendarApi={setMainCalendarApi}
              onEventosChange={setEventos}
              bandaId={bandaSelecionada?.id}
              turneId={turneSelecionada?.id}
            />
          </div>

          <div className="min-w-[27%] rounded-lg p-1 h-full bg-white flex flex-col">
            <SideCalendar mainCalendarApi={mainCalendarApi} eventos={eventos} />
            <div className="flex-1 overflow-auto">
              <TaskList eventos={eventos} />
            </div>
          </div>
        </Container>
      </main>
    </Layout>
  );
};

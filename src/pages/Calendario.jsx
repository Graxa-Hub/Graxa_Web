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
import { useTurnes } from "../hooks/useTurnes";

export const Calendario = () => {
  const [mainCalendarApi, setMainCalendarApi] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [bandaSelecionada, setBandaSelecionada] = useState(null);
  const [turneSelecionada, setTurneSelecionada] = useState(null);

  const { bandas, listarBandas } = useBandas();
  const { turnes, listarTurnes } = useTurnes();

  const [searchParams] = useSearchParams();
  const bandaIdParam = searchParams.get("bandaId");
  const turneIdParam = searchParams.get("turneId");
  

  useEffect(() => {
    listarBandas();
    listarTurnes();
  }, [listarBandas, listarTurnes]);

  // Sincroniza banda e turne selecionadas com os parâmetros da URL
  useEffect(() => {
    if (bandaIdParam && bandas.length > 0) {
      const banda = bandas.find(b => String(b.id) === String(bandaIdParam));
      setBandaSelecionada(banda || null);
    }
  }, [bandaIdParam, bandas]);

  useEffect(() => {
    // Seleciona a turnê pelo parâmetro assim que turnes estiver disponível
    if (turneIdParam && turnes.length > 0) {
      const turne = turnes.find(t => String(t.id) === String(turneIdParam));
      setTurneSelecionada(turne || null);

      // Se banda não estiver selecionada, selecione a banda da turnê
      if (turne && !bandaSelecionada) {
        const banda = bandas.find(b => String(b.id) === String(turne.bandaId));
        setBandaSelecionada(banda || null);
      }
    }
  }, [turneIdParam, turnes, bandas]);

  // Quando bandaSelecionada mudar, se a turne selecionada não pertence à banda, reseta turneSelecionada
  useEffect(() => {
    if (
      bandaSelecionada &&
      turneSelecionada &&
      String(turneSelecionada.bandaId) !== String(bandaSelecionada.id)
    ) {
      setTurneSelecionada(null);
    }
  }, [bandaSelecionada, turneSelecionada]);

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

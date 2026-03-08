import React, { useState, useEffect } from "react";
import MainCalendar from "../components/Dashboard/MainCalendar";
import SideCalendar from "../components/Dashboard/SideCalendar";
import { TaskList } from "../components/Dashboard/TaskList";
import { Layout } from "../components/templates/Layout";
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
      const banda = bandas.find((b) => String(b.id) === String(bandaIdParam));
      setBandaSelecionada(banda || null);
    }
  }, [bandaIdParam, bandas]);

  useEffect(() => {
    // Seleciona a turnê pelo parâmetro assim que turnes estiver disponível
    if (turneIdParam && turnes.length > 0) {
      const turne = turnes.find((t) => String(t.id) === String(turneIdParam));
      setTurneSelecionada(turne || null);

      // Se banda não estiver selecionada, selecione a banda da turnê
      if (turne && !bandaSelecionada) {
        const banda = bandas.find(
          (b) => String(b.id) === String(turne.bandaId),
        );
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
      <div className="flex flex-row gap-5 h-full w-full">
        <div className="flex-1 min-w-0 h-full">
          <MainCalendar
            onCalendarApi={setMainCalendarApi}
            onEventosChange={setEventos}
            bandaId={bandaSelecionada?.id}
            turneId={turneSelecionada?.id}
          />
        </div>

        <div className="w-80 min-w-[320px] rounded-md p-1 h-full bg-white flex flex-col shadow-sm">
          <SideCalendar mainCalendarApi={mainCalendarApi} eventos={eventos} />
          <div className="flex-1 overflow-auto mt-4 px-2">
            <TaskList eventos={eventos} />
          </div>
        </div>
      </div>
    </Layout >
  );
};

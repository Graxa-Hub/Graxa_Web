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

  useEffect(() => {
    if (bandaIdParam && bandas.length > 0) {
      const banda = bandas.find((b) => String(b.id) === String(bandaIdParam));
      setBandaSelecionada(banda || null);
    }
  }, [bandaIdParam, bandas]);

  useEffect(() => {
    if (turneIdParam && turnes.length > 0) {
      const turne = turnes.find((t) => String(t.id) === String(turneIdParam));
      setTurneSelecionada(turne || null);
      if (turne && !bandaSelecionada) {
        const banda = bandas.find(
          (b) => String(b.id) === String(turne.bandaId),
        );
        setBandaSelecionada(banda || null);
      }
    }
  }, [turneIdParam, turnes, bandas, bandaSelecionada]);

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
            turne={turneSelecionada}
          />
        </div>

        <div className="w-80 min-w-[320px] surface-card p-3 h-full flex flex-col">
          <SideCalendar mainCalendarApi={mainCalendarApi} eventos={eventos} />
          <div className="flex-1 overflow-auto mt-4 px-1">
            <TaskList eventos={eventos} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useBandas } from "./useBandas";
import { useTurnes } from "./useTurnes";

const findById = (list = [], id) =>
  list.find((item) => String(item.id) === String(id)) || null;

export const useCalendarioPage = () => {
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
      setBandaSelecionada(findById(bandas, bandaIdParam));
    }
  }, [bandaIdParam, bandas]);

  useEffect(() => {
    if (turneIdParam && turnes.length > 0) {
      const turne = findById(turnes, turneIdParam);
      setTurneSelecionada(turne);

      if (turne && !bandaSelecionada) {
        setBandaSelecionada(findById(bandas, turne.bandaId));
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

  const handleCalendarReady = useCallback((api) => {
    setMainCalendarApi(api || null);
  }, []);

  const handleEventosChange = useCallback((novosEventos = []) => {
    setEventos(novosEventos);
  }, []);

  return {
    mainCalendarApi,
    eventos,
    bandaSelecionada,
    turneSelecionada,
    handleCalendarReady,
    handleEventosChange,
  };
};

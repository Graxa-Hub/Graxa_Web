import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useBandas } from "./useBandas";
import { useTurnes } from "./useTurnes";
import { useAlocacoesColaborador } from "./useAlocacoesColaborador";
import { useRole } from "./useRole";

const findById = (list = [], id) =>
  list.find((item) => String(item.id) === String(id)) || null;

export function useCalendarioViewModel() {
  const [mainCalendarApi, setMainCalendarApi] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [bandaSelecionada, setBandaSelecionada] = useState(null);
  const [turneSelecionada, setTurneSelecionada] = useState(null);

  const { bandas: todasBandas, listarBandas } = useBandas();
  const { turnes: todasTurnes, listarTurnes } = useTurnes();
  const { bandas: bandasAlocadas, turnes: turnesAlocadas, isColaborador } = useAlocacoesColaborador();
  const { isCollaborator } = useRole();

  const [searchParams] = useSearchParams();

  const bandaIdParam = searchParams.get("bandaId");
  const turneIdParam = searchParams.get("turneId");

  // ✅ Usa useMemo para evitar que bandas/turnes mudem desnecessariamente
  const bandas = useMemo(
    () => (isColaborador ? bandasAlocadas : todasBandas),
    [isColaborador, bandasAlocadas, todasBandas]
  );

  const turnes = useMemo(
    () => (isColaborador ? turnesAlocadas : todasTurnes),
    [isColaborador, turnesAlocadas, todasTurnes]
  );

  // ✅ Carrega todas as bandas/turnes apenas uma vez na montagem
  useEffect(() => {
    // Se é colaborador, não carrega todas (usa alocações)
    if (!isCollaborator()) {
      listarBandas();
      listarTurnes();
    }
  }, []); // ✅ Dependências vazias - executa uma única vez

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

  return {
    bandas,
    turnes,
    eventos,
    mainCalendarApi,
    bandaSelecionada,
    turneSelecionada,
    setBandaSelecionada,
    setTurneSelecionada,
    setMainCalendarApi,
    setEventos,
  };
}

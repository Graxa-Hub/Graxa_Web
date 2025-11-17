import { useState, useCallback, useEffect } from "react";
import { showService } from "../services/showService";
import { viagemService } from "../services/viagemService";

/**
 * Hook que carrega todos os shows e viagens do backend e normaliza para formato de calendário.
 */
export function useEventosCalendario() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Converte LocalDateTime do backend (ex: "2025-11-01T18:00:00") para ISO string
   */
  const normalizarData = (data) => {
    if (!data) return null;
    // Se já é ISO string, retorna
    if (typeof data === "string" && data.includes("T")) {
      return data;
    }
    // Se é objeto Date
    if (data instanceof Date) {
      return data.toISOString();
    }
    return null;
  };

  /**
   * Carrega todos os eventos (shows + viagens) e converte para formato do FullCalendar
   */
  const carregarEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Carrega shows e viagens em paralelo
      const [resShows, resViagens] = await Promise.all([
        showService.listar().catch((e) => {
          console.error("Erro ao listar shows:", e);
          return [];
        }),
        viagemService.listar().catch((e) => {
          console.error("Erro ao listar viagens:", e);
          return [];
        }),
      ]);

      const shows = Array.isArray(resShows) ? resShows : [];
      const viagens = Array.isArray(resViagens) ? resViagens : [];

      // Normaliza shows para eventos do calendário
      const eventosShows = shows.map((show) => ({
        id: `show-${show.id}`,
        title: show.nomeEvento || "Show",
        start: normalizarData(show.dataInicio),
        end: normalizarData(show.dataFim),
        type: "show",
        originalData: show,
        classNames: ["evento-show"],
      }));

      // Normaliza viagens para eventos do calendário
      const eventosViagens = viagens.map((viagem) => ({
        id: `viagem-${viagem.id}`,
        title: viagem.nomeEvento || "Viagem",
        start: normalizarData(viagem.dataInicio),
        end: normalizarData(viagem.dataFim),
        type: "viagem",
        originalData: viagem,
        classNames: ["evento-viagem"],
      }));

      const todosEventos = [...eventosShows, ...eventosViagens];
      setEventos(todosEventos);
      return todosEventos;
    } catch (err) {
      console.error("Erro ao carregar eventos do calendário:", err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Recarrega eventos (chamado após criar/editar/deletar)
   */
  const recarregarEventos = useCallback(() => {
    return carregarEventos();
  }, [carregarEventos]);

  /**
   * Adiciona um novo evento localmente (otimismo)
   */
  const adicionarEventoLocal = useCallback((entidade, tipo) => {
    const novoEvento = {
      id: `${tipo}-${entidade.id}`,
      title: entidade.nomeEvento || entidade.titulo,
      start: normalizarData(entidade.dataInicio || entidade.dataHoraInicio),
      end: normalizarData(entidade.dataFim || entidade.dataHoraFim),
      type: tipo,
      originalData: entidade,
      classNames: [`evento-${tipo}`],
    };
    setEventos((prev) => [...prev, novoEvento]);
  }, []);

  return {
    eventos,
    loading,
    error,
    carregarEventos,
    recarregarEventos,
    adicionarEventoLocal,
    setEventos,
  };
}

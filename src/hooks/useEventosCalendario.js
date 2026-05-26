import { useState, useCallback } from "react";
import { showService } from "../services/showService";
import { viagemService } from "../services/viagemService";

export function useEventosCalendario() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Recebe filtros opcionais: bandaId e turneId
  const carregarEventos = useCallback(async (filtros = {}) => {
    const { bandaId, turneId } = filtros;
    console.log("🔍 [useEventosCalendario] Carregando com filtros:", { bandaId, turneId });

    try {
      setLoading(true);
      setError(null);

      // Busca shows e viagens em paralelo
      const [shows, viagens] = await Promise.all([
        showService.listar(),
        viagemService.listar(),
      ]);

      console.log("📊 [useEventosCalendario] Shows recebidos:", shows?.length);
      console.log("📊 [useEventosCalendario] Viagens recebidas:", viagens?.length);
      if (viagens?.length > 0) {
        console.log("🚗 Primeira viagem completa:", JSON.stringify(viagens[0], null, 2));
      }

      // ✅ Aplica filtros nos shows
      let showsFiltrados = shows || [];
      if (turneId) {
        showsFiltrados = showsFiltrados.filter(
          (show) => String(show.turne?.id || show.turneId) === String(turneId),
        );
      } else if (bandaId) {
        showsFiltrados = showsFiltrados.filter(
          (show) =>
            String(show.turne?.bandaId || show.turne?.banda?.id) ===
              String(bandaId) ||
            (Array.isArray(show.bandas) &&
              show.bandas.some((b) => String(b?.id) === String(bandaId))),
        );
      }

      console.log("✅ Shows filtrados:", showsFiltrados?.length);

      // ✅ Aplica filtros nas viagens
      // Cria um mapa de shows por ID para referência rápida
      const showsMap = {};
      (shows || []).forEach((show) => {
        showsMap[show.id] = show;
      });

      console.log("🗺️ Mapa de shows criado com", Object.keys(showsMap).length, "shows");

      let viagensFiltradas = viagens || [];
      
      if (bandaId) {
        console.log("🔎 Filtrando viagens por bandaId:", bandaId);
        // Filtra viagens que têm shows associados àquela banda
        viagensFiltradas = viagensFiltradas.filter((viagem) => {
          // A viagem pode ter showId (ID) ou show (objeto completo)
          const showId = viagem.showId || viagem.show?.id;
          console.log("📍 Verificando viagem:", viagem.id, "com showId/show.id:", showId);
          
          if (!showId) {
            console.log("  ❌ Viagem sem showId ou show");
            return false;
          }
          
          const showAssociado = showsMap[showId];
          console.log("  🎯 Show associado encontrado?", !!showAssociado);
          
          if (!showAssociado) return false; // Show precisa existir
          
          // Se turneId está definido, verifica se o show é daquela turne
          if (turneId) {
            const isFromTurne = String(showAssociado.turne?.id || showAssociado.turneId) === String(turneId);
            console.log("  🎪 É da turne", turneId, "?", isFromTurne);
            return isFromTurne;
          }
          
          // Se só bandaId, verifica se o show é daquela banda
          const isBandaMatch = 
            String(showAssociado.turne?.bandaId || showAssociado.turne?.banda?.id) ===
              String(bandaId) ||
            (Array.isArray(showAssociado.bandas) &&
              showAssociado.bandas.some((b) => String(b?.id) === String(bandaId)));
          
          console.log("  🎵 É da banda", bandaId, "?", isBandaMatch);
          return isBandaMatch;
        });
      }

      console.log("✅ Viagens filtradas:", viagensFiltradas?.length);

      // Mapeia shows para eventos do calendário
      const eventosShows = showsFiltrados.map((show) => ({
        id: `show-${show.id}`,
        title: show.nomeEvento || show.nome || "Show sem título",
        start: show.dataInicio,
        end: show.dataFim,
        backgroundColor: "#ef4444",
        borderColor: "#ef4444",
        type: "show",
        extendedProps: {
          tipo: "show",
          dados: show,
          turne: show.turne, // 📌 Adiciona turne aos dados estendidos
          banda: show.turne?.banda, // 📌 Adiciona banda aos dados estendidos
        },
      }));

      console.log("📅 Eventos de shows mapeados:", eventosShows.length);

      // Mapeia viagens para eventos do calendário
      const eventosViagens = viagensFiltradas.map((viagem) => ({
        id: `viagem-${viagem.id}`,
        title: `✈️ ${viagem.nomeEvento || viagem.tipoViagem || "Viagem"}`,
        start: viagem.dataInicio,
        end: viagem.dataFim,
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
        classNames: ["viagem-event"],
        type: "viagem",
        extendedProps: {
          tipo: "viagem",
          dados: viagem,
          turne: viagem.show?.turne, // 📌 Adiciona turne aos dados estendidos (via show)
          banda: viagem.show?.turne?.banda, // 📌 Adiciona banda aos dados estendidos
        },
      }));

      console.log("✈️ Eventos de viagens mapeados:", eventosViagens.length);

      const todosEventos = [...eventosShows, ...eventosViagens];

      console.log("🎉 Total de eventos:", todosEventos.length);

      setEventos(todosEventos);

      return todosEventos;
    } catch (err) {
      console.error("❌ [useEventosCalendario] Erro ao carregar eventos:", err);
      console.error("Stack:", err.stack);
      setError(err.message || "Erro ao carregar eventos");
      setEventos([]);
      return [];
    } finally {
      setLoading(false);
      console.log("✅ Carregamento finalizado");
    }
  }, []);

  const adicionarEventoLocal = useCallback((entidade, tipo) => {
    const novoEvento = {
      id: `${tipo}-${entidade.id}`,
      title:
        tipo === "show"
          ? entidade.nomeEvento || entidade.nomeShow || entidade.nome || "Show"
          : `✈️ ${entidade.tipoViagem || "Viagem"}`,
      start: entidade.dataInicio || entidade.dataHoraInicio,
      end: entidade.dataFim || entidade.dataHoraFim,
      backgroundColor: tipo === "show" ? "#ef4444" : "#3b82f6",
      borderColor: tipo === "show" ? "#ef4444" : "#3b82f6",
      classNames: [tipo === "show" ? "show-event" : "viagem-event"],
      type: tipo,
      extendedProps: {
        tipo,
        dados: entidade,
      },
    };

    setEventos((prev) => [...prev, novoEvento]);
  }, []);

  return {
    eventos,
    loading,
    error,
    carregarEventos,
    adicionarEventoLocal,
  };
}

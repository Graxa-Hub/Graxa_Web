import { useState, useCallback } from 'react';
import { showService } from '../services/showService';
import { viagemService } from '../services/viagemService';

export function useEventosCalendario() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Recebe filtros opcionais: bandaId e turneId
  const carregarEventos = useCallback(async (filtros = {}) => {
    const { bandaId, turneId } = filtros;
    
    console.log('[useEventosCalendario] Carregando eventos com filtros:', { bandaId, turneId });
    
    try {
      setLoading(true);
      setError(null);

      // Busca shows e viagens em paralelo
      const [shows, viagens] = await Promise.all([
        showService.listar(),
        viagemService.listar()
      ]);

      console.log('[useEventosCalendario] Shows recebidos:', shows);
      console.log('[useEventosCalendario] Viagens recebidas:', viagens);

      // ✅ Aplica filtros nos shows
      let showsFiltrados = shows || [];
      if (turneId) {
        showsFiltrados = showsFiltrados.filter(show =>
          (show.turne?.id || show.turneId) === turneId
        );
      } else if (bandaId) {
        showsFiltrados = showsFiltrados.filter(show =>
          (show.turne?.bandaId || show.turne?.banda?.id) === bandaId
        );
      }

      // ✅ Aplica filtros nas viagens
      let viagensFiltradas = viagens || [];
      if (turneId) {
        viagensFiltradas = viagensFiltradas.filter(viagem =>
          (viagem.turne?.id || viagem.turneId) === turneId
        );
      } else if (bandaId) {
        viagensFiltradas = viagensFiltradas.filter(viagem =>
          (viagem.turne?.bandaId || viagem.turne?.banda?.id) === bandaId
        );
      }

      // Mapeia shows para eventos do calendário
      const eventosShows = showsFiltrados.map(show => ({
        id: `show-${show.id}`,
        title: show.nomeEvento || show.nome || 'Show sem título',
        start: show.dataInicio,
        end: show.dataFim,
        backgroundColor: '#ef4444',
        borderColor: '#ef4444',
        type: 'show',
        extendedProps: {
          tipo: 'show',
          dados: show
        }
      }));

      // Mapeia viagens para eventos do calendário
      const eventosViagens = viagensFiltradas.map(viagem => ({
        id: `viagem-${viagem.id}`,
        title: `✈️ ${viagem.nomeEvento || viagem.tipoViagem || 'Viagem'}`,
        start: viagem.dataInicio,
        end: viagem.dataFim,
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        type: 'viagem',
        extendedProps: {
          tipo: 'viagem',
          dados: viagem
        }
      }));

      const todosEventos = [...eventosShows, ...eventosViagens];
      
      console.log('[useEventosCalendario] Total de eventos após filtros:', todosEventos.length);
      setEventos(todosEventos);
      
      return todosEventos;
    } catch (err) {
      console.error('[useEventosCalendario] Erro ao carregar eventos:', err);
      setError(err.message || 'Erro ao carregar eventos');
      setEventos([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarEventoLocal = useCallback((entidade, tipo) => {
    console.log('[useEventosCalendario] Adicionando evento local:', { entidade, tipo });
    
    const novoEvento = {
      id: `${tipo}-${entidade.id}`,
      title: tipo === 'show' 
        ? (entidade.nomeShow || entidade.nome || 'Show')
        : `✈️ ${entidade.tipoViagem || 'Viagem'}`,
      start: entidade.dataHoraInicio,
      end: entidade.dataHoraFim,
      backgroundColor: tipo === 'show' ? '#ef4444' : '#3b82f6',
      borderColor: tipo === 'show' ? '#ef4444' : '#3b82f6',
      type: tipo,
      extendedProps: {
        tipo,
        dados: entidade
      }
    };

    setEventos(prev => [...prev, novoEvento]);
  }, []);

  return {
    eventos,
    loading,
    error,
    carregarEventos,
    adicionarEventoLocal,
  };
}

import { useState, useCallback } from 'react';
import { agendaEventoService } from '../services/agendaEventoService';

export function useAgendaEvento() {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarPorShow = useCallback(async (showId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await agendaEventoService.listarPorShow(showId);
      setAgendas(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao listar agenda:', err);
      setAgendas([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(async (dto) => {
    setLoading(true);
    setError(null);
    try {
      const novaAgenda = await agendaEventoService.criar(dto);
      setAgendas(prev => [...prev, novaAgenda]);
      return novaAgenda;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao criar agenda:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizar = useCallback(async (id, dto) => {
    setLoading(true);
    setError(null);
    try {
      const agendaAtualizada = await agendaEventoService.atualizar(id, dto);
      setAgendas(prev => prev.map(a => a.id === id ? agendaAtualizada : a));
      return agendaAtualizada;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar agenda:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remover = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await agendaEventoService.remover(id);
      setAgendas(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Erro ao remover agenda:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    agendas,
    loading,
    error,
    listarPorShow,
    criar,
    atualizar,
    remover,
  };
}
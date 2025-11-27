import { useState, useCallback } from 'react';
import { showService } from '../services/showService';

export function useShows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarShows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await showService.listar();
      setShows(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao listar shows:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const criarShow = useCallback(async (showData) => {
    setLoading(true);
    setError(null);
    try {
      const novoShow = await showService.criar(showData);
      setShows(prev => [...prev, novoShow]);
      return novoShow;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao criar show:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarShow = useCallback(async (id, showData) => {
    setLoading(true);
    setError(null);
    try {
      const showAtualizado = await showService.atualizar(id, showData);
      setShows(prev => prev.map(show => show.id === id ? showAtualizado : show));
      return showAtualizado;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar show:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletarShow = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await showService.deletar(id);
      setShows(prev => prev.filter(show => show.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Erro ao deletar show:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarBandas = useCallback(async (showId, bandasIds) => {
    setLoading(true);
    setError(null);
    try {
      const showAtualizado = await showService.adicionarBandas(showId, bandasIds);
      setShows(prev => prev.map(show => show.id === showId ? showAtualizado : show));
      return showAtualizado;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao adicionar bandas:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    shows,
    loading,
    error,
    listarShows,
    criarShow,
    atualizarShow,
    deletarShow,
    adicionarBandas
  };
}
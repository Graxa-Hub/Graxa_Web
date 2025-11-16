import { useState, useCallback } from 'react';
import { viagemService } from '../services/viagemService';

export function useViagens() {
  const [viagens, setViagens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarViagens = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await viagemService.listar();
      const viagensArray = Array.isArray(data) ? data : [];
      setViagens(viagensArray);
      return viagensArray;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao listar viagens:', err);
      setViagens([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarViagem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const viagem = await viagemService.buscarPorId(id);
      return viagem;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar viagem:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const criarViagem = useCallback(async (viagemData) => {
    setLoading(true);
    setError(null);
    try {
      const novaViagem = await viagemService.criar(viagemData);
      setViagens(prev => [...prev, novaViagem]);
      return novaViagem;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao criar viagem:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarViagem = useCallback(async (id, viagemData) => {
    setLoading(true);
    setError(null);
    try {
      const viagemAtualizada = await viagemService.atualizar(id, viagemData);
      setViagens(prev => prev.map(v => v.id === id ? viagemAtualizada : v));
      return viagemAtualizada;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar viagem:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletarViagem = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await viagemService.deletar(id);
      setViagens(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Erro ao deletar viagem:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    viagens,
    loading,
    error,
    listarViagens,
    buscarViagem,
    criarViagem,
    atualizarViagem,
    deletarViagem
  };
}
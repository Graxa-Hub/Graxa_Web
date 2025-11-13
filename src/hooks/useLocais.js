import { useState, useCallback } from 'react';
import { localService } from '../services/localService';

export function useLocais() {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarLocais = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await localService.listarLocais();
      // Garantir que sempre seja um array
      setLocais(Array.isArray(data) ? data : []);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Erro ao listar locais:', err);
      setError(err.response?.data?.message || 'Erro ao carregar locais');
      setLocais([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const criarLocal = useCallback(async (dados) => {
    try {
      setLoading(true);
      setError(null);
      const novoLocal = await localService.criarLocal(dados);
      setLocais((prev) => [...prev, novoLocal]);
      return novoLocal;
    } catch (err) {
      console.error('Erro ao criar local:', err);
      setError(err.response?.data?.message || 'Erro ao criar local');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    locais,
    loading,
    error,
    listarLocais,
    criarLocal,
  };
}
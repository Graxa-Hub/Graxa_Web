import { useState, useCallback } from 'react';
import { getTurnes, criarTurne as criarTurneService, editarTurne, deletarTurne } from '../services/turneService';

export function useTurnes() {
  const [turnes, setTurnes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarTurnes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTurnes();
      console.log('Turnês carregadas:', data);
      setTurnes(Array.isArray(data) ? data : []);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Erro ao listar turnês:', err);
      setError(err.response?.data?.message || 'Erro ao carregar turnês');
      setTurnes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(async (dados) => {
    try {
      setLoading(true);
      setError(null);
      const novaTurne = await criarTurneService(dados);
      setTurnes((prev) => [...prev, novaTurne]);
      return novaTurne;
    } catch (err) {
      console.error('Erro ao criar turnê:', err);
      setError(err.response?.data?.message || 'Erro ao criar turnê');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    turnes,
    loading,
    error,
    listarTurnes,
    criarTurne: criar,
  };
}
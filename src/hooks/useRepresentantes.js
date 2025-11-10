import { useState, useCallback } from 'react';
import { representanteService } from '../services/representanteService';

export function useRepresentantes() {
  const [representantes, setRepresentantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarRepresentantes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await representanteService.listarRepresentantes();
      setRepresentantes(data);
      return data;
    } catch (err) {
      console.error('Erro ao listar representantes:', err);
      setError(err.response?.data?.message || 'Erro ao carregar representantes');
      setRepresentantes([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarRepresentantePorId = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await representanteService.buscarRepresentantePorId(id);
      return data;
    } catch (err) {
      console.error('Erro ao buscar representante:', err);
      setError(err.response?.data?.message || 'Erro ao buscar representante');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const criarRepresentante = useCallback(async (dados) => {
    try {
      setLoading(true);
      setError(null);
      // dados esperados: { nome, email }
      const novoRepresentante = await representanteService.criarRepresentante(dados);
      setRepresentantes((prev) => [...prev, novoRepresentante]);
      return novoRepresentante;
    } catch (err) {
      console.error('Erro ao criar representante:', err);
      setError(err.response?.data?.message || 'Erro ao criar representante');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    representantes,
    loading,
    error,
    listarRepresentantes,
    buscarRepresentantePorId,
    criarRepresentante,
  };
}
import { useState, useCallback } from 'react';
import { artistaService } from '../services/artistaService';

export function useArtistas() {
  const [artistas, setArtistas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarArtistas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await artistaService.listarArtistas();
      setArtistas(data);
      return data;
    } catch (err) {
      console.error('Erro ao listar artistas:', err);
      setError(err.response?.data?.message || 'Erro ao carregar artistas');
      setArtistas([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const criarArtista = useCallback(async (dados) => {
    try {
      setLoading(true);
      setError(null);
      const novoArtista = await artistaService.criarArtista(dados);
      setArtistas((prev) => [...prev, novoArtista]);
      return novoArtista;
    } catch (err) {
      console.error('Erro ao criar artista:', err);
      setError(err.response?.data?.message || 'Erro ao criar artista');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarPorId = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await artistaService.buscarPorId(id);
      return data;
    } catch (err) {
      console.error('Erro ao buscar artista:', err);
      setError(err.response?.data?.message || 'Erro ao buscar artista');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    artistas,
    loading,
    error,
    listarArtistas,
    criarArtista,
    buscarPorId,
  };
}
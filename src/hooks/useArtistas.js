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
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarArtistaPorId = useCallback(async (id) => {
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

  const atualizarArtista = useCallback(async (id, dados) => {
    try {
      setLoading(true);
      setError(null);
      const artistaAtualizado = await artistaService.atualizarArtista(id, dados);
      setArtistas((prev) =>
        prev.map((artista) => (artista.id === id ? artistaAtualizado : artista))
      );
      return artistaAtualizado;
    } catch (err) {
      console.error('Erro ao atualizar artista:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar artista');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const excluirArtista = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await artistaService.excluirArtista(id);
      setArtistas((prev) => prev.filter((artista) => artista.id !== id));
    } catch (err) {
      console.error('Erro ao excluir artista:', err);
      setError(err.response?.data?.message || 'Erro ao excluir artista');
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
    buscarArtistaPorId,
    criarArtista,
    atualizarArtista,
    excluirArtista,
  };
}
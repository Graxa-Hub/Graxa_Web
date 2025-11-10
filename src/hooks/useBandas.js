import { useState, useCallback } from 'react';
import { bandaService } from '../services/bandaService';
import { imagemService } from '../services/imagemService';

export function useBandas() {
  const [bandas, setBandas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarBandas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bandaService.listarBandas();
      setBandas(data);
      return data;
    } catch (err) {
      console.error('Erro ao listar bandas:', err);
      setError(err.response?.data?.message || 'Erro ao carregar bandas');
      setBandas([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarBandaPorId = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const data = await bandaService.buscarBandaPorId(id);
      return data;
    } catch (err) {
      console.error('Erro ao buscar banda:', err);
      setError(err.response?.data?.message || 'Erro ao buscar banda');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const criarBanda = useCallback(async (dados, foto) => {
    try {
      setLoading(true);
      setError(null);
      const novaBanda = await bandaService.criarBanda(dados, foto);
      setBandas((prev) => [...prev, novaBanda]);
      return novaBanda;
    } catch (err) {
      console.error('Erro ao criar banda:', err);
      setError(err.response?.data?.message || 'Erro ao criar banda');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarIntegrantes = useCallback(async (bandaId, integrantesIds) => {
    try {
      setLoading(true);
      setError(null);
      const bandaAtualizada = await bandaService.adicionarIntegrantes(bandaId, integrantesIds);
      setBandas((prev) =>
        prev.map((banda) => (banda.id === bandaId ? bandaAtualizada : banda))
      );
      return bandaAtualizada;
    } catch (err) {
      console.error('Erro ao adicionar integrantes:', err);
      setError(err.response?.data?.message || 'Erro ao adicionar integrantes');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarImagem = useCallback(async (nomeArquivo) => {
    try {
      if (!nomeArquivo) return null;
      return await imagemService(nomeArquivo);
    } catch (err) {
      console.error('Erro ao buscar imagem:', err);
      return null;
    }
  }, []);

  return {
    bandas,
    loading,
    error,
    listarBandas,
    buscarBandaPorId,
    criarBanda,
    adicionarIntegrantes,
    buscarImagem,
  };
}
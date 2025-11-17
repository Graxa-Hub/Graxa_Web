import { useState, useCallback } from "react";
import { bandaService } from "../services/bandaService";
import { imagemService } from "../services/imagemService";

export function useBandas() {
  const [bandas, setBandas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarBandas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bandaService.listarBandas();
      // Suporta tanto array direto quanto objeto com propriedade content
      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];
      setBandas(lista);
      return data;
    } catch (err) {
      console.error('Erro ao listar bandas:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.mensagem;

      // Não mostra erro se for apenas "nenhuma banda encontrada"
      if (errorMessage && errorMessage.includes('Não há bandas salvas')) {
        setBandas([]);
        return [];
      }

      setError(errorMessage || 'Erro ao carregar bandas');
      setBandas([]);
      return [];
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
      console.error("Erro ao buscar banda:", err);
      setError(err.response?.data?.message || "Erro ao buscar banda");
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
      const errorMessage = err.response?.data?.message || err.response?.data?.mensagem || 'Erro ao criar banda';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarBanda = useCallback(async (id, dados, foto) => {
    try {
      setLoading(true);
      setError(null);
      const bandaAtualizada = await bandaService.atualizarBanda(
        id,
        dados,
        foto
      );
      setBandas((prev) =>
        prev.map((banda) => (banda.id === id ? bandaAtualizada : banda))
      );
      return bandaAtualizada;
    } catch (err) {
      console.error("Erro ao atualizar banda:", err);
      setError(err.response?.data?.message || "Erro ao atualizar banda");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const excluirBanda = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await bandaService.excluirBanda(id);
      setBandas((prev) => prev.filter((banda) => banda.id !== id));
    } catch (err) {
      console.error("Erro ao excluir banda:", err);
      setError(err.response?.data?.message || "Erro ao excluir banda");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarIntegrantes = useCallback(async (bandaId, integrantesIds) => {
    try {
      setLoading(true);
      setError(null);
      const bandaAtualizada = await bandaService.adicionarIntegrantes(
        bandaId,
        integrantesIds
      );
      setBandas((prev) =>
        prev.map((banda) => (banda.id === bandaId ? bandaAtualizada : banda))
      );
      return bandaAtualizada;
    } catch (err) {
      console.error("Erro ao adicionar integrantes:", err);
      setError(err.response?.data?.message || "Erro ao adicionar integrantes");
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
    atualizarBanda,
    excluirBanda,
    adicionarIntegrantes,
    buscarImagem,
  };
}

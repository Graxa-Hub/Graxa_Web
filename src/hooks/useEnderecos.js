import { useState, useCallback } from 'react';
import { enderecoService } from '../services/enderecoService';

export function useEnderecos() {
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarEnderecos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await enderecoService.listar();
      setEnderecos(data);
      console.log('Endereços carregados:', data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao listar endereços:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const criarEndereco = useCallback(async (enderecoData) => {
    setLoading(true);
    setError(null);
    try {
      const novoEndereco = await enderecoService.criar(enderecoData);
      setEnderecos(prev => [...prev, novoEndereco]);
      return novoEndereco;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao criar endereço:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarEndereco = useCallback(async (id, enderecoData) => {
    setLoading(true);
    setError(null);
    try {
      const enderecoAtualizado = await enderecoService.atualizar(id, enderecoData);
      setEnderecos(prev => prev.map(end => end.id === id ? enderecoAtualizado : end));
      return enderecoAtualizado;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar endereço:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletarEndereco = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await enderecoService.deletar(id);
      setEnderecos(prev => prev.filter(end => end.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Erro ao deletar endereço:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    enderecos,
    loading,
    error,
    listarEnderecos,
    criarEndereco,
    atualizarEndereco,
    deletarEndereco
  };
}
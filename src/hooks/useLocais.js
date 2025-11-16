import { useState, useCallback } from 'react';
import { localService } from '../services/localService';
import { enderecoService } from '../services/enderecoService';

export function useLocais() {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listarLocais = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await localService.listar();
      console.log('Locais carregados:', data);
      // Garante que sempre retorna um array
      const locaisArray = Array.isArray(data) ? data : [];
      setLocais(locaisArray);
      return locaisArray;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao listar locais:', err);
      setLocais([]); // Define array vazio em caso de erro
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const criarLocal = useCallback(async (localData) => {
    setLoading(true);
    setError(null);
    try {
      // Remove qualquer formatação e converte para número
      const numeroEndereco = String(localData.endereco.numero || '0').replace(/\D/g, '');
      const capacidadeLocal = String(localData.capacidade || '0').replace(/\D/g, '');

      // Primeiro cria o endereço
      const enderecoPayload = {
        tipoEndereco: 'local', // ⚠️ MINÚSCULO conforme o enum
        cep: localData.endereco.cep,
        logradouro: localData.endereco.logradouro,
        bairro: localData.endereco.bairro || '',
        numero: parseInt(numeroEndereco, 10),
        complemento: localData.endereco.complemento || '',
        cidade: localData.endereco.cidade,
        estado: localData.endereco.estado,
        pais: localData.endereco.pais || 'Brasil'
      };

      console.log('Payload do endereço:', enderecoPayload);
      const enderecoResponse = await enderecoService.criar(enderecoPayload);
      console.log('Endereço criado:', enderecoResponse);

      // Depois cria o local com o ID do endereço
      const localPayload = {
        nome: localData.nome,
        idEndereco: enderecoResponse.id,
        capacidade: parseInt(capacidadeLocal, 10)
      };

      console.log('Payload do local:', localPayload);
      const novoLocal = await localService.criar(localPayload);
      console.log('Local criado:', novoLocal);
      
      setLocais(prev => [...prev, novoLocal]);
      return novoLocal;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao criar local:', err);
      console.error('Erro detalhado:', err.response?.data);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarLocal = useCallback(async (id, localData) => {
    setLoading(true);
    setError(null);
    try {
      const localAtualizado = await localService.atualizar(id, localData);
      setLocais(prev => prev.map(local => local.id === id ? localAtualizado : local));
      return localAtualizado;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar local:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletarLocal = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await localService.deletar(id);
      setLocais(prev => prev.filter(local => local.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Erro ao deletar local:', err);
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
    atualizarLocal,
    deletarLocal
  };
}
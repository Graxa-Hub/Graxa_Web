import { useState, useCallback } from 'react';

export function useShowDetails() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarShow = useCallback(async (showId) => {
    if (!showId) {
      console.log('🔍 [useShowDetails] buscarShow - showId é null ou undefined');
      return null;
    }

    console.log('🔍 [useShowDetails] Iniciando busca do show:', showId);
    setLoading(true);
    setError(null);
    
    try {
      const url = `${import.meta.env.VITE_API_SPRING || 'http://localhost:8080'}/shows/${showId}`;
      console.log('🔍 [useShowDetails] URL da requisição:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔍 [useShowDetails] Response status:', response.status);
      console.log('🔍 [useShowDetails] Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const show = await response.json();
      console.log('🔍 [useShowDetails] Show recebido da API:');
      console.log('📦 OBJETO COMPLETO:', JSON.stringify(show, null, 2));
      console.log('📋 Propriedades do show:', Object.keys(show));
      console.log('🎭 Nome do evento:', show.nomeEvento);
      console.log('📅 Data início:', show.dataInicio);
      console.log('📅 Data fim:', show.dataFim);
      console.log('📍 Local:', show.local);
      console.log('🎵 Banda:', show.banda);
      console.log('📝 Descrição:', show.descricao);
      
      return show;
    } catch (err) {
      console.error('❌ [useShowDetails] Erro ao buscar show:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarAlocacao = useCallback(async (alocacaoId) => {
    if (!alocacaoId) {
      console.log('🔍 [useShowDetails] buscarAlocacao - alocacaoId é null ou undefined');
      return null;
    }

    console.log('🔍 [useShowDetails] Iniciando busca da alocação:', alocacaoId);
    setLoading(true);
    setError(null);
    
    try {
      const url = `${import.meta.env.VITE_API_SPRING || 'http://localhost:8080'}/alocacoes/${alocacaoId}`;
      console.log('🔍 [useShowDetails] URL da requisição alocação:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('🔍 [useShowDetails] Alocação response status:', response.status);

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const alocacao = await response.json();
      console.log('🔍 [useShowDetails] Alocação recebida da API:');
      console.log('📦 OBJETO ALOCAÇÃO COMPLETO:', JSON.stringify(alocacao, null, 2));
      console.log('📋 Propriedades da alocação:', Object.keys(alocacao));
      console.log('🆔 ID da alocação:', alocacao.id);
      console.log('👤 Colaborador:', alocacao.colaborador);
      console.log('🎭 Show da alocação:', alocacao.show);
      console.log('📊 Status:', alocacao.status);
      console.log('🎯 Função:', alocacao.funcao);
      
      return alocacao;
    } catch (err) {
      console.error('❌ [useShowDetails] Erro ao buscar alocação:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    buscarShow,
    buscarAlocacao,
    loading,
    error
  };
}
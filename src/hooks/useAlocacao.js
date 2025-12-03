import { useState, useCallback, useRef } from 'react';
import { alocacaoService } from '../services/alocacaoService';
import { imagemService } from '../services/imagemService';

export const useAlocacao = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const jaCarregouImagens = useRef(new Map());

  // ✅ FUNÇÃO CENTRALIZADA: Executar operação com loading e error handling
  const executarOperacao = useCallback(async (operacao, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await operacao(...args);
      return resultado;
    } catch (err) {
      console.error(`❌ Erro na operação:`, err);
      setError(err.message || 'Erro desconheido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ FUNÇÃO: Responder alocação (aceitar/recusar)
  const responderAlocacao = async (alocacaoId, status) => {
    try {
      setLoading(true);
      const response = await alocacaoService.responderAlocacao(alocacaoId, status);
      return response;
    } catch (err) {
      console.log('❌ Erro ao responder alocação:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao responder alocação');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNÇÃO: Criar alocação única
  const criarAlocacao = useCallback(async (showId, colaboradorId) => {
    return executarOperacao(async () => {
      const resultado = await alocacaoService.criarAlocacao({ showId, colaboradorId });
      return resultado;
    });
  }, [executarOperacao]);

  // ✅ FUNÇÃO: Carregar foto com cache
  const carregarFotoColaborador = useCallback(async (fotoNome) => {
    if (!fotoNome) {
      return 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto';
    }

    if (jaCarregouImagens.current.has(fotoNome)) {
      console.log(`✅ Foto do cache: ${fotoNome}`);
      return jaCarregouImagens.current.get(fotoNome);
    }

    try {
      const fotoUrl = await imagemService(fotoNome);
      jaCarregouImagens.current.set(fotoNome, fotoUrl);
      console.log(`✅ Foto carregada: ${fotoNome}`);
      return fotoUrl;
    } catch (err) {
      console.error(`❌ Erro ao carregar foto ${fotoNome}:`, err);
      return 'https://placehold.co/300x300/e2e8f0/64748b?text=Erro';
    }
  }, []);

  // ✅ FUNÇÃO: Listar alocações por show (com fotos)
  const listarPorShow = useCallback(async (showId) => {
    return executarOperacao(async () => {
      const alocacoes = await alocacaoService.listarPorShow(showId);
      console.log('📋 Alocações do show (sem fotos):', alocacoes);

      const alocacoesComFotos = await Promise.all(
        alocacoes.map(async (alocacao) => {
          const fotoUrl = await carregarFotoColaborador(alocacao.colaborador?.fotoNome);
          
          return {
            ...alocacao,
            colaborador: {
              ...alocacao.colaborador,
              fotoUrl
            }
          };
        })
      );

      console.log('📋 Alocações com fotos:', alocacoesComFotos);
      return alocacoesComFotos;
    });
  }, [executarOperacao, carregarFotoColaborador]);

  // ✅ UTILITÁRIOS
  const limparCacheImagens = useCallback(() => {
    jaCarregouImagens.current.clear();
    console.log('🧹 Cache de imagens limpo');
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // ✅ Estados
    loading,
    error,
    
    // ✅ Funções principais
    criarAlocacao,
    responderAlocacao,
    listarPorShow,
    
    // ✅ Utilitários
    carregarFotoColaborador,
    limparCacheImagens,
    resetError
  };
};

// ✅ COMPATIBILIDADE: Export com nomes antigos
export const useAlocacoes = useAlocacao;

// ✅ Export default
export default useAlocacao;
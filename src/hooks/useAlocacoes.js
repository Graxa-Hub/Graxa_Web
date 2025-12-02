import { useState, useRef } from 'react';
import { alocacaoService } from '../services/alocacaoService';
import { imagemService } from '../services/imagemService';

export const useAlocacoes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const jaCarregouImagens = useRef(new Map());

  const criarAlocacao = async (showId, colaboradorId) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await alocacaoService.criarAlocacao({ showId, colaboradorId });
      console.log('✅ Alocação criada:', resultado);
      return resultado;
    } catch (err) {
      console.error('❌ Erro ao criar alocação:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const criarAlocacoes = async (showId, colaboradoresIds) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultados = await alocacaoService.criarAlocacoes(showId, colaboradoresIds);
      console.log('✅ Alocações criadas:', resultados);
      return resultados;
    } catch (err) {
      console.error('❌ Erro ao criar alocações:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ NOVA FUNÇÃO: Atualizar status
  const atualizarStatus = async (alocacaoId, novoStatus) => {
    setLoading(true);
    setError(null);
    
    try {
      const resultado = await alocacaoService.atualizarStatus(alocacaoId, novoStatus);
      console.log('✅ Status atualizado:', resultado);
      return resultado;
    } catch (err) {
      console.error('❌ Erro ao atualizar status:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const listarPorShow = async (showId) => {
    setLoading(true);
    setError(null);
    
    try {
      const alocacoes = await alocacaoService.listarPorShow(showId);
      console.log('📋 Alocações do show (sem fotos):', alocacoes);

      const alocacoesComFotos = await Promise.all(
        alocacoes.map(async (alocacao) => {
          let fotoUrl = null;

          if (alocacao.colaborador?.fotoNome) {
            if (jaCarregouImagens.current.has(alocacao.colaborador.fotoNome)) {
              fotoUrl = jaCarregouImagens.current.get(alocacao.colaborador.fotoNome);
              console.log(`✅ Foto do cache: ${alocacao.colaborador.fotoNome}`);
            } else {
              try {
                fotoUrl = await imagemService(alocacao.colaborador.fotoNome);
                jaCarregouImagens.current.set(alocacao.colaborador.fotoNome, fotoUrl);
                console.log(`✅ Foto carregada: ${alocacao.colaborador.fotoNome}`);
              } catch (err) {
                console.error(`❌ Erro ao carregar foto ${alocacao.colaborador.fotoNome}:`, err);
                fotoUrl = 'https://placehold.co/300x300/e2e8f0/64748b?text=Erro';
              }
            }
          } else {
            fotoUrl = 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto';
          }

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
    } catch (err) {
      console.error('❌ Erro ao listar alocações:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    criarAlocacao,
    criarAlocacoes,
    listarPorShow,
    atualizarStatus, // ✅ EXPORTAR
    loading,
    error
  };
};
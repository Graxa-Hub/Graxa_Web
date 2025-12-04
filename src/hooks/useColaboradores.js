import { useState, useCallback, useRef } from 'react';
import { colaboradorService } from '../services/colaboradorService';
import { imagemService } from '../services/imagemService';

export function useColaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const jaCarregouImagens = useRef(new Map()); // ✅ Mudado para Map

  const listarColaboradores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await colaboradorService.listarColaboradores();
      const colaboradoresArray = data || [];

      const colaboradoresComImagem = await Promise.all(
        colaboradoresArray.map(async (colab) => {
          let fotoUrl = null;

          if (colab.fotoNome) {
            // ✅ Verifica se já tem no cache pelo fotoNome
            if (jaCarregouImagens.current.has(colab.fotoNome)) {
              fotoUrl = jaCarregouImagens.current.get(colab.fotoNome);
            } else {
              try {
                fotoUrl = await imagemService(colab.fotoNome);
                jaCarregouImagens.current.set(colab.fotoNome, fotoUrl);
              } catch (err) {
                console.error('[useColaboradores] Erro ao carregar imagem:', err);
                fotoUrl = 'https://placehold.co/300x300/e2e8f0/64748b?text=Erro';
                jaCarregouImagens.current.set(colab.fotoNome, fotoUrl);
              }
            }
          } else {
            fotoUrl = 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto';
          }

          return {
            ...colab,
            fotoUrl
          };
        })
      );

      setColaboradores(colaboradoresComImagem);
      return colaboradoresComImagem;
    } catch (err) {
      setError(err.message);
      console.error('[useColaboradores] Erro ao listar colaboradores:', err);
      setColaboradores([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarColaboradorPorId = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await colaboradorService.buscarColaboradorPorId(id);
      
      let fotoUrl = null;
      if (data.fotoNome) {
        if (jaCarregouImagens.current.has(data.fotoNome)) {
          fotoUrl = jaCarregouImagens.current.get(data.fotoNome);
        } else {
          try {
            fotoUrl = await imagemService(data.fotoNome);
            jaCarregouImagens.current.set(data.fotoNome, fotoUrl);
          } catch (err) {
            console.error('[useColaboradores] Erro ao carregar imagem:', err);
            fotoUrl = 'https://placehold.co/300x300/e2e8f0/64748b?text=Erro';
          }
        }
      } else {
        fotoUrl = 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto';
      }

      return {
        ...data,
        fotoUrl
      };
    } catch (err) {
      setError(err.message);
      console.error('[useColaboradores] Erro ao buscar colaborador:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const criarColaborador = useCallback(async (dados, foto) => {
    setLoading(true);
    setError(null);
    try {
      const novoColaborador = await colaboradorService.criarColaborador(dados, foto);

      let fotoUrl = null;
      if (novoColaborador.fotoNome) {
        try {
          fotoUrl = await imagemService(novoColaborador.fotoNome);
          jaCarregouImagens.current.set(novoColaborador.fotoNome, fotoUrl);
        } catch (err) {
          console.error('[useColaboradores] Erro ao carregar imagem do novo colaborador:', err);
          fotoUrl = 'https://placehold.co/300x300/e2e8f0/64748b?text=Erro';
        }
      } else {
        fotoUrl = 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto';
      }

      const colaboradorComImagem = {
        ...novoColaborador,
        fotoUrl
      };

      setColaboradores(prev => [...prev, colaboradorComImagem]);
      return colaboradorComImagem;
    } catch (err) {
      setError(err.message);
      console.error('[useColaboradores] Erro ao criar colaborador:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarColaborador = useCallback(async (id, dados, foto) => {
    setLoading(true);
    setError(null);
    try {
      let fotoNome = dados.fotoNome;

      if (foto) {
        fotoNome = await colaboradorService.uploadFoto(foto);
        // Remove cache da foto antiga
        if (dados.fotoNome) {
          jaCarregouImagens.current.delete(dados.fotoNome);
        }
      }

      const colaboradorAtualizado = await colaboradorService.atualizarColaborador(id, {
        ...dados,
        fotoNome,
      });

      let fotoUrl = null;
      if (colaboradorAtualizado.fotoNome) {
        try {
          fotoUrl = await imagemService(colaboradorAtualizado.fotoNome);
          jaCarregouImagens.current.set(colaboradorAtualizado.fotoNome, fotoUrl);
        } catch (err) {
          console.error('[useColaboradores] Erro ao carregar imagem do colaborador atualizado:', err);
          fotoUrl = 'https://placehold.co/300x300/e2e8f0/64748b?text=Erro';
        }
      } else {
        fotoUrl = 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Foto';
      }

      const colaboradorComImagem = {
        ...colaboradorAtualizado,
        fotoUrl
      };

      setColaboradores(prev => prev.map(c => c.id === id ? colaboradorComImagem : c));
      return colaboradorComImagem;
    } catch (err) {
      setError(err.message);
      console.error('[useColaboradores] Erro ao atualizar colaborador:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const excluirColaborador = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const colab = colaboradores.find(c => c.id === id);
      await colaboradorService.excluirColaborador(id);
      
      // Remove do cache
      if (colab?.fotoNome) {
        jaCarregouImagens.current.delete(colab.fotoNome);
      }
      
      setColaboradores(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('[useColaboradores] Erro ao excluir colaborador:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [colaboradores]);

  return {
    colaboradores,
    loading,
    error,
    listarColaboradores,
    buscarColaboradorPorId,
    criarColaborador,
    atualizarColaborador,
    excluirColaborador,
  };
}
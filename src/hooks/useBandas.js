import { useState, useCallback, useRef } from 'react';
import { bandaService } from '../services/bandaService';
import { imagemService } from '../services/imagemService';

export function useBandas() {
  const [bandas, setBandas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const jaCarregouImagens = useRef(new Set());

  const listarBandas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bandaService.listarBandas();
      console.log('[useBandas] Bandas carregadas do servidor:', data);
      
      const bandasArray = data || [];
      
      const bandasComImagem = await Promise.all(
        bandasArray.map(async (banda) => {
          if (jaCarregouImagens.current.has(banda.id)) {
            console.log('[useBandas] Banda já processada:', banda.nome);
            const bandaExistente = bandas.find(b => b.id === banda.id);
            if (bandaExistente?.imagemUrl) {
              return bandaExistente;
            }
          }

          let imagemUrl = null;
          
          if (banda.nomeFoto) {
            try {
              console.log('[useBandas] Carregando imagem para:', banda.nome);
              imagemUrl = await imagemService(banda.nomeFoto);
              jaCarregouImagens.current.add(banda.id);
              console.log('[useBandas] Imagem carregada para:', banda.nome);
            } catch (err) {
              console.error('[useBandas] Erro ao carregar imagem:', err);
              jaCarregouImagens.current.add(banda.id);
            }
          } else {
            jaCarregouImagens.current.add(banda.id);
          }
          
          return {
            ...banda,
            imagemUrl: imagemUrl || 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Imagem'
          };
        })
      );
      
      console.log('[useBandas] Total de bandas com imagem:', bandasComImagem.length);
      setBandas(bandasComImagem);
      return bandasComImagem;
    } catch (err) {
      setError(err.message);
      console.error('[useBandas] Erro ao listar bandas:', err);
      setBandas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const buscarBandaPorId = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bandaService.buscarBandaPorId(id);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('[useBandas] Erro ao buscar banda:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const criarBanda = useCallback(async (dados, foto) => {
    setLoading(true);
    setError(null);
    try {
      const novaBanda = await bandaService.criarBanda(dados, foto);
      
      let imagemUrl = null;
      if (novaBanda.imagem) {
        try {
          imagemUrl = await imagemService(novaBanda.imagem);
          jaCarregouImagens.current.add(novaBanda.id);
        } catch (err) {
          console.error('[useBandas] Erro ao carregar imagem da nova banda:', err);
        }
      }
      
      const bandaComImagem = {
        ...novaBanda,
        imagemUrl: imagemUrl || 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Imagem'
      };
      
      setBandas(prev => [...prev, bandaComImagem]);
      return bandaComImagem;
    } catch (err) {
      setError(err.message);
      console.error('[useBandas] Erro ao criar banda:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizarBanda = useCallback(async (id, dados, foto) => {
    setLoading(true);
    setError(null);
    try {
      const bandaAtualizada = await bandaService.atualizarBanda(id, dados, foto);
      
      let imagemUrl = null;
      if (bandaAtualizada.imagem) {
        try {
          imagemUrl = await imagemService(bandaAtualizada.imagem);
          jaCarregouImagens.current.add(id);
        } catch (err) {
          console.error('[useBandas] Erro ao carregar imagem da banda atualizada:', err);
        }
      }
      
      const bandaComImagem = {
        ...bandaAtualizada,
        imagemUrl: imagemUrl || 'https://placehold.co/300x300/e2e8f0/64748b?text=Sem+Imagem'
      };
      
      setBandas(prev => prev.map(b => b.id === id ? bandaComImagem : b));
      return bandaComImagem;
    } catch (err) {
      setError(err.message);
      console.error('[useBandas] Erro ao atualizar banda:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const excluirBanda = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await bandaService.excluirBanda(id);
      jaCarregouImagens.current.delete(id);
      setBandas(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('[useBandas] Erro ao excluir banda:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const adicionarIntegrantes = useCallback(async (bandaId, artistasIds) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[useBandas] Adicionando integrantes:', { bandaId, artistasIds });
      const bandaAtualizada = await bandaService.adicionarIntegrantes(bandaId, artistasIds);
      
      setBandas(prev => prev.map(b => 
        b.id === bandaId 
          ? { ...b, integrantes: bandaAtualizada.integrantes } 
          : b
      ));
      
      return bandaAtualizada;
    } catch (err) {
      setError(err.message);
      console.error('[useBandas] Erro ao adicionar integrantes:', err);
      throw err;
    } finally {
      setLoading(false);
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
  };
}

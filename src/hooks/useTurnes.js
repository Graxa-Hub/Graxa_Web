import { useState, useCallback, useRef } from 'react';
import { getTurnes, criarTurne as criarTurneService } from '../services/turneService';
import { imagemService } from '../services/imagemService';

export function useTurnes() {
  const [turnes, setTurnes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const jaCarregouImagens = useRef(new Set()); // IDs já processados

  const listarTurnes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Busca turnês
      const data = await getTurnes();
      
      
      const turnesArray = Array.isArray(data) ? data : [];
      
      // Carrega imagens apenas das turnês que ainda não foram processadas
      const turnesComImagem = await Promise.all(
        turnesArray.map(async (turne) => {
          // Se já processou essa turnê, não reprocessa
          if (jaCarregouImagens.current.has(turne.id)) {
            
            const turneExistente = turnes.find(t => t.id === turne.id);
            if (turneExistente?.imagemUrl) {
              return turneExistente;
            }
          }

          let imagemUrl = null;
          
          if (turne.nomeImagem) {
            try {
              
              imagemUrl = await imagemService(turne.nomeImagem);
              jaCarregouImagens.current.add(turne.id);
            
            } catch (err) {
              console.error('[useTurnes] Erro ao carregar imagem:', err);
              jaCarregouImagens.current.add(turne.id);
            }
          } else {
            jaCarregouImagens.current.add(turne.id);
          }
          
          return {
            ...turne,
            imagemUrl: imagemUrl || 'https://placehold.co/64x64/e2e8f0/64748b?text=Sem+Imagem'
          };
        })
      );
      

      setTurnes(turnesComImagem);
      return turnesComImagem;
    } catch (err) {
      console.error('Erro ao listar turnês:', err);
      setError(err.response?.data?.message || 'Erro ao carregar turnês');
      setTurnes([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // ✅ Sem dependências - função estável

  const criar = useCallback(async (dados) => {
    try {
      setLoading(true);
      setError(null);
      const novaTurne = await criarTurneService(dados);
      
      // Carrega imagem da nova turnê
      let imagemUrl = null;
      if (novaTurne.nomeFoto) {
        try {
          imagemUrl = await imagemService(novaTurne.nomeFoto);
          jaCarregouImagens.current.add(novaTurne.id);
        } catch (err) {
          console.error('[useTurnes] Erro ao carregar imagem da nova turnê:', err);
        }
      }
      
      const turneComImagem = {
        ...novaTurne,
        imagemUrl: imagemUrl || 'https://placehold.co/64x64/e2e8f0/64748b?text=Sem+Imagem'
      };
      
      setTurnes((prev) => [...prev, turneComImagem]);
      return turneComImagem;
    } catch (err) {
      console.error('Erro ao criar turnê:', err);
      setError(err.response?.data?.message || 'Erro ao criar turnê');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    turnes,
    loading,
    error,
    listarTurnes,
    criarTurne: criar,
  };
}
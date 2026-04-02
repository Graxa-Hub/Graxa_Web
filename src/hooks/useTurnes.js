import { useState, useCallback, useRef } from 'react';
import { getTurnes, criarTurne as criarTurneService } from '../services/turneService';
import { imagemService } from '../services/imagemService';
import { adaptTurnesFromBackend } from '../utils/turneAdapter';

export function useTurnes() {
  const [turnes, setTurnes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const jaCarregouImagens = useRef(new Set()); // IDs já processados

const listarTurnes = useCallback(async (page = 0) => {
  try {
    setLoading(true);
    setError(null);

    // Busca turnês paginadas do backend (tamanho controlado pelo backend)
    const data = await getTurnes(page);

    // Adapta os dados para o formato esperado pela UI
    const turnesAdaptados = await adaptTurnesFromBackend(data);

    setTurnes(turnesAdaptados);

    // Retorna também os metadados de paginação
    return {
      content: turnesAdaptados,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      pageNumber: data.number,
      pageSize: data.size,
      first: data.first,
      last: data.last
    };
  } catch (err) {
    console.error('Erro ao listar turnês:', err);
    setError(err.response?.data?.message || 'Erro ao carregar turnês');
    setTurnes([]);
    return { content: [], totalPages: 0 };
  } finally {
    setLoading(false);
  }
}, []);

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
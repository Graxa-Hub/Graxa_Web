import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useRole } from "./useRole";
import { alocacaoService } from "../services/alocacaoService";

/**
 * Hook que busca bandas/turnes alocadas a um colaborador
 * Usado para filtrar a agenda apenas com events relevantes
 */
export function useAlocacoesColaborador() {
  const { usuario } = useAuth();
  const { isCollaborator } = useRole();
  const [alocacoes, setAlocacoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const jaCarregou = useRef(false); // Flag para carregar uma única vez

  // Extrai turnes únicas das alocações
  const extrairTurnesUnicas = useCallback((alocacoesList = []) => {
    const turnesMap = new Map();

    alocacoesList.forEach((alocacao) => {
      // A alocação tem um show associado que tem turne
      if (alocacao.show?.turne) {
        const turne = alocacao.show.turne;
        if (!turnesMap.has(turne.id)) {
          turnesMap.set(turne.id, turne);
        }
      }
    });

    return Array.from(turnesMap.values());
  }, []);

  // Extrai bandas únicas das turnes
  const extrairBandasUnicas = useCallback((turnesList = []) => {
    const bandasMap = new Map();

    turnesList.forEach((turne) => {
      if (turne.banda) {
        if (!bandasMap.has(turne.banda.id)) {
          bandasMap.set(turne.banda.id, turne.banda);
        }
      }
    });

    return Array.from(bandasMap.values());
  }, []);

  // Carrega alocações do colaborador - APENAS UMA VEZ
  useEffect(() => {
    // Só carrega se for colaborador e tiver ID
    if (!isCollaborator() || !usuario?.id) {
      console.log(
        "[useAlocacoesColaborador] Usuário não é colaborador ou sem ID"
      );
      setAlocacoes([]);
      jaCarregou.current = true;
      return;
    }

    // Se já carregou, não carrega novamente
    if (jaCarregou.current) {
      return;
    }

    // Marca como carregado
    jaCarregou.current = true;

    const carregarAlocacoes = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(
          "[useAlocacoesColaborador] Buscando alocações para colaborador:",
          usuario.id
        );

        const alocacoesFetched = await alocacaoService.listarPorColaborador(
          usuario.id
        );

        console.log(
          "[useAlocacoesColaborador] Alocações recebidas:",
          alocacoesFetched
        );

        setAlocacoes(alocacoesFetched);
      } catch (err) {
        console.error("[useAlocacoesColaborador] Erro ao carregar:", err);
        setError(err.message);
        setAlocacoes([]);
      } finally {
        setLoading(false);
      }
    };

    carregarAlocacoes();
  }, []); // ✅ Dependências vazias = carrega uma única vez

  // Extrai dados úteis
  const turnes = extrairTurnesUnicas(alocacoes);
  const bandas = extrairBandasUnicas(turnes);

  return {
    alocacoes,
    bandas,
    turnes,
    loading,
    error,
    isColaborador: isCollaborator(),
  };
}

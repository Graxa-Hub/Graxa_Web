// src/hooks/useLogistica.js
import { useState, useCallback } from "react";
import { logisticaService } from "../services/logisticaService";

/**
 * Hook genérico para gerenciar recursos de logística (hotéis, voos, transportes)
 * @param {string} resourceType - Tipo do recurso: 'hotel', 'flight', 'transporte'
 * @returns {Object} - Estado e funções CRUD para o recurso
 */
export const useLogistica = (resourceType) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mapear tipo de recurso para nome do serviço
  const serviceMap = {
    hotel: {
      listar: logisticaService.listarHoteis,
      criar: logisticaService.criarHotelEvento,
      atualizar: logisticaService.atualizarHotelEvento,
      remover: logisticaService.removerHotelEvento,
    },
    flight: {
      listar: logisticaService.listarVoos,
      criar: logisticaService.criarVooEvento,
      atualizar: logisticaService.atualizarVooEvento,
      remover: logisticaService.removerVooEvento,
    },
    transporte: {
      listar: logisticaService.listarTransportes,
      criar: logisticaService.criarTransporteEvento,
      atualizar: logisticaService.atualizarTransporteEvento,
      remover: logisticaService.removerTransporteEvento,
    },
  };

  const service = serviceMap[resourceType];

  if (!service) {
    throw new Error(`Tipo de recurso inválido: ${resourceType}. Use 'hotel', 'flight' ou 'transporte'.`);
  }

  /**
   * Listar recursos por showId
   */
  const listar = useCallback(
    async (showId) => {
      if (!showId) return [];

      setLoading(true);
      setError(null);

      try {
        const response = await service.listar(showId);
        setData(response);
        return Array.isArray(response) ? response : [];
      } catch (err) {
        console.error(`Erro ao listar ${resourceType}:`, err);
        setError(err.message || `Erro ao buscar ${resourceType}`);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [service, resourceType]
  );

  /**
   * Criar novo recurso
   */
  const criar = useCallback(
    async (payload) => {
      setLoading(true);
      setError(null);

      try {
        const response = await service.criar(payload);
        setData((prev) => [...prev, response]);
        return response;
      } catch (err) {
        console.error(`Erro ao criar ${resourceType}:`, err);
        setError(err.message || `Erro ao criar ${resourceType}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, resourceType]
  );

  /**
   * Atualizar recurso existente
   */
  const atualizar = useCallback(
    async (id, payload) => {
      setLoading(true);
      setError(null);

      try {
        console.debug(`[useLogistica][${resourceType}] Atualizar:`, { id, payload });
        // Loga o payload enviado
        console.log(`[useLogistica][${resourceType}] Payload enviado para atualizar:`, JSON.stringify(payload));
        const response = await service.atualizar(id, payload);
        // Loga a resposta do backend
        console.log(`[useLogistica][${resourceType}] Resposta recebida do backend:`, JSON.stringify(response));
        setData((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              // Faz merge do antigo com o novo para garantir que campos não retornados pelo backend sejam preservados
              return { ...item, ...response };
            }
            return item;
          })
        );
        return response;
      } catch (err) {
        console.error(`Erro ao atualizar ${resourceType}:`, err);
        setError(err.message || `Erro ao atualizar ${resourceType}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, resourceType]
  );

  /**
   * Remover recurso
   */
  const remover = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        console.debug(`[useLogistica][${resourceType}] Remover:`, { id });
        await service.remover(id);
        setData((prev) => prev.filter((item) => item.id !== id));
        return { success: true };
      } catch (err) {
        let motivo = '';
        if (err?.response?.data?.message) {
          motivo = err.response.data.message;
        } else if (err?.message) {
          motivo = err.message;
        } else {
          motivo = `Erro ao remover ${resourceType}`;
        }
        console.error(`Erro ao remover ${resourceType}:`, motivo, err);
        setError(motivo);
        return { success: false, error: motivo };
      } finally {
        setLoading(false);
      }
    },
    [service, resourceType]
  );

  return {
    data,
    loading,
    error,
    listar,
    criar,
    atualizar,
    remover,
    setData, // Permitir controle manual do estado quando necessário
  };
};

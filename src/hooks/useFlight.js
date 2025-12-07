import { useState, useCallback } from "react";
import { logisticaService } from "../services/logisticaService";

export function useVooEvento() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listar = useCallback(async (showId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await logisticaService.listarVoos(showId);
      setFlights(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao listar voos:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(async (dto) => {
    setLoading(true);
    setError(null);
    try {
      const novo = await logisticaService.criarVooEvento(dto);
      setFlights((prev) => [...prev, novo]);
      return novo;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao criar voo:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizar = useCallback(async (id, dto) => {
    setLoading(true);
    setError(null);
    try {
      const atualizado = await logisticaService.atualizarVooEvento(id, dto);
      setFlights((prev) => prev.map((f) => (f.id === id ? atualizado : f)));
      return atualizado;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao atualizar voo:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remover = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await logisticaService.removerVooEvento(id);
      setFlights((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Erro ao remover voo:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { flights, loading, error, listar, criar, atualizar, remover };
}

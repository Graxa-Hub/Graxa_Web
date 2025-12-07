import { useState, useCallback } from "react";
import { logisticaService } from "../services/logisticaService";

export function useHotelEvento() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listar = useCallback(async (showId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await logisticaService.listarHoteis(showId);
      setHotels(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao listar hotéis:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(async (dto) => {
    setLoading(true);
    setError(null);
    try {
      const novo = await logisticaService.criarHotelEvento(dto);
      setHotels((prev) => [...prev, novo]);
      return novo;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao criar hotel:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizar = useCallback(async (id, dto) => {
    setLoading(true);
    setError(null);
    try {
      const atualizado = await logisticaService.atualizarHotelEvento(id, dto);
      setHotels((prev) => prev.map((h) => (h.id === id ? atualizado : h)));
      return atualizado;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao atualizar hotel:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remover = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await logisticaService.removerHotelEvento(id);
      setHotels((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Erro ao remover hotel:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { hotels, loading, error, listar, criar, atualizar, remover };
}

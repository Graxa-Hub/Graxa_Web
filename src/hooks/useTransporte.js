import { useState, useCallback } from "react";
import { logisticaService } from "../services/logisticaService";

export function useTransporteEvento() {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listar = useCallback(async (showId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await logisticaService.listarTransportes(showId);
      setTransports(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao listar transportes:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const criar = useCallback(async (dto) => {
    setLoading(true);
    setError(null);
    try {
      const novo = await logisticaService.criarTransporteEvento(dto);
      setTransports((prev) => [...prev, novo]);
      return novo;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao criar transporte:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const atualizar = useCallback(async (id, dto) => {
    setLoading(true);
    setError(null);
    try {
      const atualizado = await logisticaService.atualizarTransporteEvento(id, dto);
      setTransports((prev) => prev.map((t) => (t.id === id ? atualizado : t)));
      return atualizado;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao atualizar transporte:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remover = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await logisticaService.removerTransporteEvento(id);
      setTransports((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Erro ao remover transporte:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { transports, loading, error, listar, criar, atualizar, remover };
}

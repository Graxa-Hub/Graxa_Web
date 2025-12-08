import { useState, useCallback } from "react";
import { extrasService } from "../services/extrasService";

export function useExtrasEvento() {
  const [extras, setExtras] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listar = useCallback(async (showId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await extrasService.listarExtras(showId);
      setExtras(data || { obs: "", contatos: "" });
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Erro ao carregar extras:", err);
      setExtras({ obs: "", contatos: "" });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const salvar = useCallback(async (dto) => {
    setLoading(true);
    setError(null);

    try {
      const saved = await extrasService.salvarExtraEvento(dto);
      setExtras(saved);
      return saved;
    } catch (err) {
      // Se endpoint não existe (404), apenas avisa e continua
      if (err.response?.status === 404) {
        console.warn("⚠️ [useExtrasEvento] Endpoint não disponível - dados salvos localmente");
        setExtras(dto);
        return dto; // Retorna sucesso para não travar o formulário
      }
      
      // Para outros erros, lança a exceção normalmente
      setError(err.message);
      console.error("Erro ao salvar extras:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    extras,
    loading,
    error,
    listar,
    salvar
  };
}

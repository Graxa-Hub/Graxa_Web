import { useState, useEffect } from "react";
import { 
  getWeather, 
  getCurrentWeather, 
  getForecast, 
  getHourlyForecast,
  analyzeWeatherForEvent 
} from "../services/weatherService";

/**
 * Hook para buscar dados de clima
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Object} options - Opções de configuração
 * @returns {Object} Estado do clima
 */
export function useWeather(lat, lon, options = {}) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    autoFetch = true, // Buscar automaticamente ao montar
    days = 7,
    hourly = false,
  } = options;

  const fetchWeather = async () => {
    if (!lat || !lon) {
      setError("Coordenadas não fornecidas");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getWeather(lat, lon, { days, hourly });
      setWeather(data);
    } catch (err) {
      setError(err.message || "Erro ao buscar clima");
      console.error("Erro no useWeather:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && lat && lon) {
      fetchWeather();
    }
  }, [lat, lon, autoFetch, days, hourly]);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather,
  };
}

/**
 * Hook simplificado para buscar apenas o clima atual
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {boolean} autoFetch - Buscar automaticamente
 * @returns {Object} Estado do clima atual
 */
export function useCurrentWeather(lat, lon, autoFetch = true) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!lat || !lon) {
      setError("Coordenadas não fornecidas");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getCurrentWeather(lat, lon);
      setWeather(data);
    } catch (err) {
      setError(err.message || "Erro ao buscar clima");
      console.error("Erro no useCurrentWeather:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && lat && lon) {
      fetchWeather();
    }
  }, [lat, lon, autoFetch]);

  return {
    weather,
    loading,
    error,
    refetch: fetchWeather,
  };
}

/**
 * Hook para buscar previsão dos próximos dias
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} days - Número de dias
 * @param {boolean} autoFetch - Buscar automaticamente
 * @returns {Object} Estado da previsão
 */
export function useForecast(lat, lon, days = 7, autoFetch = true) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForecast = async () => {
    if (!lat || !lon) {
      setError("Coordenadas não fornecidas");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getForecast(lat, lon, days);
      setForecast(data);
    } catch (err) {
      setError(err.message || "Erro ao buscar previsão");
      console.error("Erro no useForecast:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && lat && lon) {
      fetchForecast();
    }
  }, [lat, lon, days, autoFetch]);

  return {
    forecast,
    loading,
    error,
    refetch: fetchForecast,
  };
}

/**
 * Hook para buscar previsão horária
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} days - Número de dias
 * @param {boolean} autoFetch - Buscar automaticamente
 * @returns {Object} Estado da previsão horária
 */
export function useHourlyForecast(lat, lon, days = 3, autoFetch = true) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForecast = async () => {
    if (!lat || !lon) {
      setError("Coordenadas não fornecidas");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getHourlyForecast(lat, lon, days);
      setForecast(data);
    } catch (err) {
      setError(err.message || "Erro ao buscar previsão horária");
      console.error("Erro no useHourlyForecast:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch && lat && lon) {
      fetchForecast();
    }
  }, [lat, lon, days, autoFetch]);

  return {
    forecast,
    loading,
    error,
    refetch: fetchForecast,
  };
}

/**
 * Hook para analisar se o clima é favorável para um evento
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {boolean} autoFetch - Buscar automaticamente
 * @returns {Object} Análise do clima
 */
export function useWeatherAnalysis(lat, lon, autoFetch = true) {
  const { weather, loading, error, refetch } = useWeather(lat, lon, { 
    autoFetch, 
    days: 1 
  });
  
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (weather) {
      const result = analyzeWeatherForEvent(weather);
      setAnalysis(result);
    }
  }, [weather]);

  return {
    weather,
    analysis,
    loading,
    error,
    refetch,
  };
}

export default useWeather;

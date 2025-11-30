import { useState, useEffect } from "react";
import { geocode } from "../services/directions";
import {
  getCurrentWeather,
  getRainForecast,
  getWeatherForecast,
  getWeatherDescription,
  getWindScale,
  getRainyDays,
} from "../services/weatherService";

/**
 * Hook para buscar dados climáticos atuais
 * @param {string} location - Endereço ou nome da localização
 * @returns {Object} Estado com dados climáticos e funções
 */
export function useCurrentWeather(location) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // Primeiro, geocodifica o endereço
        const coords = await geocode(location);
        // Depois busca o clima
        const weatherData = await getCurrentWeather(coords.lat, coords.lon);
        const description = getWeatherDescription(weatherData.weather_code);

        setWeather({
          ...weatherData,
          description,
          windScale: getWindScale(weatherData.wind_speed_10m),
        });
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar clima atual:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  return { weather, loading, error };
}

/**
 * Hook para buscar previsão de chuva
 * @param {string} location - Endereço ou nome da localização
 * @param {number} days - Número de dias de previsão
 * @returns {Object} Estado com previsão de chuva
 */
export function useRainForecast(location, days = 7) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      try {
        const coords = await geocode(location);
        const rainData = await getRainForecast(coords.lat, coords.lon, days);
        const rainyDays = getRainyDays(rainData.daily);

        setForecast({
          ...rainData,
          rainyDays,
        });
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar previsão de chuva:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [location, days]);

  return { forecast, loading, error };
}

/**
 * Hook para buscar previsão completa do tempo
 * @param {string} location - Endereço ou nome da localização
 * @param {Object} options - Opções de configuração
 * @returns {Object} Estado com previsão completa
 */
export function useWeatherForecast(location, options = {}) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);
      try {
        const coords = await geocode(location);
        const weatherData = await getWeatherForecast(coords.lat, coords.lon, options);

        // Adiciona descrições aos códigos de clima
        const enrichedData = {
          ...weatherData,
          current: weatherData.current
            ? {
              ...weatherData.current,
              description: getWeatherDescription(weatherData.current.weather_code),
            }
            : null,
          daily: weatherData.daily
            ? {
              ...weatherData.daily,
              descriptions: weatherData.daily.weather_code?.map((code) =>
                getWeatherDescription(code)
              ),
            }
            : null,
        };

        setForecast(enrichedData);
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar previsão do tempo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [location, JSON.stringify(options)]);

  return { forecast, loading, error };
}

/**
 * Hook para buscar clima usando coordenadas diretamente
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Object} Estado com dados climáticos
 */
export function useWeatherByCoords(latitude, longitude) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const weatherData = await getCurrentWeather(latitude, longitude);
        const description = getWeatherDescription(weatherData.weather_code);

        setWeather({
          ...weatherData,
          description,
          windScale: getWindScale(weatherData.wind_speed_10m),
        });
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar clima:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  return { weather, loading, error, refetch: () => fetchWeather() };
}

/**
 * Hook para buscar clima específico de um evento
 * @param {string} location - Endereço ou nome da localização
 * @param {string} eventDate - Data do evento (formato: YYYY-MM-DD)
 * @returns {Object} Estado com clima do evento (temp max/min e se vai chover)
 */
export function useEventWeather(location, eventDate) {
  const [eventWeather, setEventWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location || !eventDate) return;

    const fetchEventWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // Importa dinamicamente para evitar circular dependency
        const { getEventWeather } = await import("../services/weatherService");

        // Geocodifica o endereço
        const coords = await geocode(location);

        // Busca clima do evento
        const weatherData = await getEventWeather(coords.lat, coords.lon, eventDate);

        setEventWeather(weatherData);
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar clima do evento:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventWeather();
  }, [location, eventDate]);

  return { eventWeather, loading, error };
}

/**
 * Hook para buscar clima de um evento usando coordenadas diretas
 * @param {number} latitude - Latitude do local
 * @param {number} longitude - Longitude do local
 * @param {string} eventDate - Data do evento (formato: YYYY-MM-DD)
 * @returns {Object} Estado com clima do evento
 */
export function useEventWeatherByCoords(latitude, longitude, eventDate) {
  const [eventWeather, setEventWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!latitude || !longitude || !eventDate) return;

    const fetchEventWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const { getEventWeather } = await import("../services/weatherService");
        const weatherData = await getEventWeather(latitude, longitude, eventDate);
        setEventWeather(weatherData);
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar clima do evento:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventWeather();
  }, [latitude, longitude, eventDate]);

  return { eventWeather, loading, error };
}

/**
 * Hook para buscar previsão horária (próximas horas)
 * @param {string} location - Endereço ou nome da localização
 * @param {number} hours - Número de horas de previsão (padrão: 24)
 * @returns {Object} Estado com previsão horária
 */
export function useHourlyWeather(location, hours = 24) {
  const [hourlyWeather, setHourlyWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!location) return;

    const fetchHourlyWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const coords = await geocode(location);
        const weatherData = await getWeatherForecast(coords.lat, coords.lon, {
          forecastDays: 1,
          hourlyParams: [
            "temperature_2m",
            "precipitation",
            "weather_code",
            "precipitation_probability",
          ],
          dailyParams: [
            "temperature_2m_max",
            "temperature_2m_min",
          ],
          currentParams: [
            "temperature_2m",
            "precipitation",
            "weather_code",
            "is_day",
          ],
        });

        // Pega apenas as próximas X horas
        const now = new Date();
        const currentHourIndex = now.getHours();

        const nextHours = weatherData.hourly.time
          .slice(currentHourIndex, currentHourIndex + hours)
          .map((time, index) => ({
            time: time,
            temperature: weatherData.hourly.temperature_2m[currentHourIndex + index],
            precipitation: weatherData.hourly.precipitation[currentHourIndex + index],
            weatherCode: weatherData.hourly.weather_code[currentHourIndex + index],
            precipitationProbability: weatherData.hourly.precipitation_probability?.[currentHourIndex + index],
          }));

        setHourlyWeather({
          current: weatherData.current,
          hours: nextHours,
          daily: {
            tempMax: weatherData.daily.temperature_2m_max[0],
            tempMin: weatherData.daily.temperature_2m_min[0],
          },
          location: {
            latitude: weatherData.latitude,
            longitude: weatherData.longitude,
          },
        });
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar previsão horária:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHourlyWeather();
  }, [location, hours]);

  return { hourlyWeather, loading, error };
}

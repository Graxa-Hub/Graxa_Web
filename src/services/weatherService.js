/**
 * Open-Meteo Weather Service
 * API gratuita sem necessidade de chave de API
 * Docs: https://open-meteo.com/en/docs
 */

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Códigos de clima da API Open-Meteo
 * https://open-meteo.com/en/docs#weathervariables
 */
export const WEATHER_CODES = {
  0: { description: "Céu limpo", icon: "☀️" },
  1: { description: "Principalmente limpo", icon: "🌤️" },
  2: { description: "Parcialmente nublado", icon: "⛅" },
  3: { description: "Nublado", icon: "☁️" },
  45: { description: "Neblina", icon: "🌫️" },
  48: { description: "Névoa com geada", icon: "🌫️" },
  51: { description: "Garoa leve", icon: "🌦️" },
  53: { description: "Garoa moderada", icon: "🌦️" },
  55: { description: "Garoa intensa", icon: "🌧️" },
  56: { description: "Garoa congelante leve", icon: "🌧️" },
  57: { description: "Garoa congelante intensa", icon: "🌧️" },
  61: { description: "Chuva leve", icon: "🌧️" },
  63: { description: "Chuva moderada", icon: "🌧️" },
  65: { description: "Chuva forte", icon: "⛈️" },
  66: { description: "Chuva congelante leve", icon: "🌧️" },
  67: { description: "Chuva congelante forte", icon: "🌧️" },
  71: { description: "Neve leve", icon: "🌨️" },
  73: { description: "Neve moderada", icon: "🌨️" },
  75: { description: "Neve forte", icon: "❄️" },
  77: { description: "Grãos de neve", icon: "🌨️" },
  80: { description: "Pancada de chuva leve", icon: "🌦️" },
  81: { description: "Pancada de chuva moderada", icon: "⛈️" },
  82: { description: "Pancada de chuva forte", icon: "⛈️" },
  85: { description: "Pancada de neve leve", icon: "🌨️" },
  86: { description: "Pancada de neve forte", icon: "🌨️" },
  95: { description: "Tempestade", icon: "⛈️" },
  96: { description: "Tempestade com granizo leve", icon: "⛈️" },
  99: { description: "Tempestade com granizo forte", icon: "⛈️" },
};

/**
 * Busca clima atual e previsão para uma localização
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} Dados do clima
 */
export async function getWeather(lat, lon, options = {}) {
  if (!lat || !lon) {
    throw new Error("Latitude e longitude são obrigatórias");
  }

  const {
    days = 7, // Dias de previsão (1-16)
    hourly = false, // Se deve incluir previsão horária
    current = true, // Se deve incluir clima atual
  } = options;

  // Parâmetros da API
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    timezone: "America/Sao_Paulo",
  });

  // Variáveis atuais
  if (current) {
    params.append("current", [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "rain",
      "weather_code",
      "cloud_cover",
      "wind_speed_10m",
      "wind_direction_10m",
    ].join(","));
  }

  // Variáveis diárias
  params.append("daily", [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "sunrise",
    "sunset",
    "precipitation_sum",
    "rain_sum",
    "precipitation_probability_max",
    "wind_speed_10m_max",
    "wind_gusts_10m_max",
  ].join(","));

  // Variáveis horárias (opcional)
  if (hourly) {
    params.append("hourly", [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation_probability",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
    ].join(","));
  }

  params.append("forecast_days", days.toString());

  const url = `${BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar clima: ${response.status}`);
    }

    const data = await response.json();

    return formatWeatherData(data);
  } catch (error) {
    console.error("Erro ao buscar dados do clima:", error);
    throw error;
  }
}

/**
 * Busca apenas o clima atual (simplificado)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Clima atual
 */
export async function getCurrentWeather(lat, lon) {
  const data = await getWeather(lat, lon, { days: 1, hourly: false });
  return data.current;
}

/**
 * Busca previsão para os próximos dias
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} days - Número de dias (1-16)
 * @returns {Promise<Object>} Previsão diária
 */
export async function getForecast(lat, lon, days = 7) {
  const data = await getWeather(lat, lon, { days, hourly: false });
  return data.daily;
}

/**
 * Busca previsão horária
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} days - Número de dias (1-16)
 * @returns {Promise<Object>} Previsão horária
 */
export async function getHourlyForecast(lat, lon, days = 3) {
  const data = await getWeather(lat, lon, { days, hourly: true });
  return data.hourly;
}

/**
 * Formata os dados da API em um formato mais amigável
 * @param {Object} rawData - Dados brutos da API
 * @returns {Object} Dados formatados
 */
function formatWeatherData(rawData) {
  const formatted = {
    location: {
      latitude: rawData.latitude,
      longitude: rawData.longitude,
      timezone: rawData.timezone,
      elevation: rawData.elevation,
    },
  };

  // Formata clima atual
  if (rawData.current) {
    const weatherCode = rawData.current.weather_code;
    formatted.current = {
      time: rawData.current.time,
      temperature: rawData.current.temperature_2m,
      feelsLike: rawData.current.apparent_temperature,
      humidity: rawData.current.relative_humidity_2m,
      precipitation: rawData.current.precipitation,
      rain: rawData.current.rain,
      weatherCode: weatherCode,
      weatherDescription: WEATHER_CODES[weatherCode]?.description || "Desconhecido",
      weatherIcon: WEATHER_CODES[weatherCode]?.icon || "🌡️",
      cloudCover: rawData.current.cloud_cover,
      windSpeed: rawData.current.wind_speed_10m,
      windDirection: rawData.current.wind_direction_10m,
      isDay: rawData.current.is_day === 1,
    };
  }

  // Formata previsão diária
  if (rawData.daily) {
    formatted.daily = rawData.daily.time.map((time, index) => {
      const weatherCode = rawData.daily.weather_code[index];
      return {
        date: time,
        weatherCode: weatherCode,
        weatherDescription: WEATHER_CODES[weatherCode]?.description || "Desconhecido",
        weatherIcon: WEATHER_CODES[weatherCode]?.icon || "🌡️",
        tempMax: rawData.daily.temperature_2m_max[index],
        tempMin: rawData.daily.temperature_2m_min[index],
        sunrise: rawData.daily.sunrise[index],
        sunset: rawData.daily.sunset[index],
        precipitationSum: rawData.daily.precipitation_sum[index],
        rainSum: rawData.daily.rain_sum[index],
        precipitationProbability: rawData.daily.precipitation_probability_max[index],
        windSpeedMax: rawData.daily.wind_speed_10m_max[index],
        windGustsMax: rawData.daily.wind_gusts_10m_max[index],
      };
    });
  }

  // Formata previsão horária
  if (rawData.hourly) {
    formatted.hourly = rawData.hourly.time.map((time, index) => {
      const weatherCode = rawData.hourly.weather_code[index];
      return {
        time: time,
        temperature: rawData.hourly.temperature_2m[index],
        humidity: rawData.hourly.relative_humidity_2m[index],
        precipitationProbability: rawData.hourly.precipitation_probability[index],
        precipitation: rawData.hourly.precipitation[index],
        weatherCode: weatherCode,
        weatherDescription: WEATHER_CODES[weatherCode]?.description || "Desconhecido",
        weatherIcon: WEATHER_CODES[weatherCode]?.icon || "🌡️",
        windSpeed: rawData.hourly.wind_speed_10m[index],
      };
    });
  }

  return formatted;
}

/**
 * Verifica se o clima é favorável para um evento ao ar livre
 * @param {Object} weather - Dados do clima
 * @returns {Object} Análise do clima
 */
export function analyzeWeatherForEvent(weather) {
  if (!weather || !weather.current) {
    return { favorable: null, warnings: ["Dados do clima não disponíveis"] };
  }

  const warnings = [];
  const { current } = weather;

  // Verifica chuva
  if (current.precipitation > 0) {
    warnings.push(`Chuva prevista: ${current.precipitation}mm`);
  }

  // Verifica temperatura extrema
  if (current.temperature < 10) {
    warnings.push(`Temperatura baixa: ${current.temperature}°C`);
  } else if (current.temperature > 35) {
    warnings.push(`Temperatura alta: ${current.temperature}°C`);
  }

  // Verifica vento forte
  if (current.windSpeed > 30) {
    warnings.push(`Vento forte: ${current.windSpeed} km/h`);
  }

  // Verifica cobertura de nuvens
  if (current.cloudCover > 80) {
    warnings.push(`Muito nublado: ${current.cloudCover}%`);
  }

  const favorable = warnings.length === 0;

  return {
    favorable,
    warnings,
    recommendation: favorable 
      ? "Condições favoráveis para evento ao ar livre" 
      : "Considere precauções ou local coberto",
    summary: `${current.weatherDescription}, ${current.temperature}°C`,
  };
}

export default {
  getWeather,
  getCurrentWeather,
  getForecast,
  getHourlyForecast,
  analyzeWeatherForEvent,
  WEATHER_CODES,
};

// Open-Meteo Weather Service
// API gratuita para previsão do tempo
// Documentação: https://open-meteo.com/en/docs

const BASE_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Busca previsão do tempo para uma localização
 * @param {number} latitude - Latitude da localização
 * @param {number} longitude - Longitude da localização
 * @param {Object} options - Opções adicionais
 * @returns {Promise<Object>} Dados da previsão do tempo
 */
export async function getWeatherForecast(latitude, longitude, options = {}) {
    const {
        forecastDays = 7,
        timezone = "auto",
        hourlyParams = ["temperature_2m", "precipitation", "weather_code", "wind_speed_10m"],
        dailyParams = ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "weather_code", "precipitation_probability_max"],
        currentParams = ["temperature_2m", "relative_humidity_2m", "apparent_temperature", "precipitation", "weather_code", "wind_speed_10m"],
    } = options;

    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        forecast_days: forecastDays.toString(),
        timezone,
    });

    // Adiciona parâmetros hourly
    if (hourlyParams.length > 0) {
        params.append("hourly", hourlyParams.join(","));
    }

    // Adiciona parâmetros daily
    if (dailyParams.length > 0) {
        params.append("daily", dailyParams.join(","));
    }

    // Adiciona parâmetros current
    if (currentParams.length > 0) {
        params.append("current", currentParams.join(","));
    }

    const url = `${BASE_URL}?${params.toString()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro na API Open-Meteo: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Erro ao buscar previsão do tempo:", error);
        throw error;
    }
}

/**
 * Busca apenas as condições climáticas atuais
 * @param {number} latitude - Latitude da localização
 * @param {number} longitude - Longitude da localização
 * @returns {Promise<Object>} Condições climáticas atuais
 */
export async function getCurrentWeather(latitude, longitude) {
    const data = await getWeatherForecast(latitude, longitude, {
        forecastDays: 1,
        hourlyParams: [],
        dailyParams: [],
        currentParams: [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "is_day",
            "precipitation",
            "rain",
            "showers",
            "snowfall",
            "weather_code",
            "cloud_cover",
            "pressure_msl",
            "wind_speed_10m",
            "wind_direction_10m",
            "wind_gusts_10m",
        ],
    });

    return {
        ...data.current,
        current_units: data.current_units,
        location: {
            latitude: data.latitude,
            longitude: data.longitude,
            elevation: data.elevation,
            timezone: data.timezone,
        },
    };
}

/**
 * Busca previsão de chuva específica
 * @param {number} latitude - Latitude da localização
 * @param {number} longitude - Longitude da localização
 * @param {number} days - Número de dias (padrão: 7)
 * @returns {Promise<Object>} Previsão de precipitação
 */
export async function getRainForecast(latitude, longitude, days = 7) {
    const data = await getWeatherForecast(latitude, longitude, {
        forecastDays: days,
        hourlyParams: ["precipitation", "precipitation_probability", "rain", "showers"],
        dailyParams: [
            "precipitation_sum",
            "rain_sum",
            "showers_sum",
            "precipitation_hours",
            "precipitation_probability_max",
        ],
        currentParams: ["precipitation", "rain"],
    });

    return {
        current: data.current,
        hourly: data.hourly,
        daily: data.daily,
        location: {
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.timezone,
        },
    };
}

/**
 * Interpreta o código WMO do clima
 * @param {number} code - Código WMO
 * @returns {Object} Descrição e ícone do clima
 */
export function getWeatherDescription(code) {
    const weatherCodes = {
        0: { description: "Céu limpo", icon: "☀️", severity: "good" },
        1: { description: "Principalmente limpo", icon: "🌤️", severity: "good" },
        2: { description: "Parcialmente nublado", icon: "⛅", severity: "moderate" },
        3: { description: "Nublado", icon: "☁️", severity: "moderate" },
        45: { description: "Neblina", icon: "🌫️", severity: "moderate" },
        48: { description: "Neblina com geada", icon: "🌫️", severity: "moderate" },
        51: { description: "Garoa leve", icon: "🌦️", severity: "moderate" },
        53: { description: "Garoa moderada", icon: "🌦️", severity: "moderate" },
        55: { description: "Garoa intensa", icon: "🌧️", severity: "warning" },
        56: { description: "Garoa congelante leve", icon: "🌧️", severity: "warning" },
        57: { description: "Garoa congelante intensa", icon: "🌧️", severity: "warning" },
        61: { description: "Chuva leve", icon: "🌧️", severity: "moderate" },
        63: { description: "Chuva moderada", icon: "🌧️", severity: "warning" },
        65: { description: "Chuva forte", icon: "⛈️", severity: "danger" },
        66: { description: "Chuva congelante leve", icon: "🌧️", severity: "warning" },
        67: { description: "Chuva congelante forte", icon: "⛈️", severity: "danger" },
        71: { description: "Neve fraca", icon: "🌨️", severity: "moderate" },
        73: { description: "Neve moderada", icon: "🌨️", severity: "warning" },
        75: { description: "Neve forte", icon: "❄️", severity: "danger" },
        77: { description: "Granizo", icon: "🌨️", severity: "warning" },
        80: { description: "Pancada de chuva leve", icon: "🌦️", severity: "moderate" },
        81: { description: "Pancada de chuva moderada", icon: "🌧️", severity: "warning" },
        82: { description: "Pancada de chuva violenta", icon: "⛈️", severity: "danger" },
        85: { description: "Pancada de neve leve", icon: "🌨️", severity: "moderate" },
        86: { description: "Pancada de neve forte", icon: "❄️", severity: "danger" },
        95: { description: "Tempestade", icon: "⛈️", severity: "danger" },
        96: { description: "Tempestade com granizo leve", icon: "⛈️", severity: "danger" },
        99: { description: "Tempestade com granizo forte", icon: "⛈️", severity: "danger" },
    };

    return weatherCodes[code] || { description: "Desconhecido", icon: "❓", severity: "unknown" };
}

/**
 * Converte velocidade do vento para escala Beaufort
 * @param {number} windSpeed - Velocidade do vento em km/h
 * @returns {Object} Escala Beaufort com descrição
 */
export function getWindScale(windSpeed) {
    if (windSpeed < 1) return { scale: 0, description: "Calmaria" };
    if (windSpeed < 6) return { scale: 1, description: "Aragem" };
    if (windSpeed < 12) return { scale: 2, description: "Brisa leve" };
    if (windSpeed < 20) return { scale: 3, description: "Brisa fraca" };
    if (windSpeed < 29) return { scale: 4, description: "Brisa moderada" };
    if (windSpeed < 39) return { scale: 5, description: "Brisa forte" };
    if (windSpeed < 50) return { scale: 6, description: "Vento fresco" };
    if (windSpeed < 62) return { scale: 7, description: "Vento forte" };
    if (windSpeed < 75) return { scale: 8, description: "Ventania" };
    if (windSpeed < 89) return { scale: 9, description: "Ventania forte" };
    if (windSpeed < 103) return { scale: 10, description: "Tempestade" };
    if (windSpeed < 118) return { scale: 11, description: "Tempestade violenta" };
    return { scale: 12, description: "Furacão" };
}

/**
 * Verifica se há risco de chuva em determinado período
 * @param {Object} dailyData - Dados diários da previsão
 * @param {number} threshold - Limite de precipitação em mm (padrão: 1mm)
 * @returns {Array} Dias com risco de chuva
 */
export function getRainyDays(dailyData, threshold = 1) {
    if (!dailyData || !dailyData.time || !dailyData.precipitation_sum) {
        return [];
    }

    const rainyDays = [];
    for (let i = 0; i < dailyData.time.length; i++) {
        if (dailyData.precipitation_sum[i] >= threshold) {
            rainyDays.push({
                date: dailyData.time[i],
                precipitation: dailyData.precipitation_sum[i],
                probability: dailyData.precipitation_probability_max?.[i] || null,
                weatherCode: dailyData.weather_code?.[i] || null,
            });
        }
    }

    return rainyDays;
}

/**
 * Busca informações climáticas específicas para um evento
 * Retorna temperatura (max/min) e se vai chover no dia
 * @param {number} latitude - Latitude do local
 * @param {number} longitude - Longitude do local
 * @param {string} eventDate - Data do evento (formato: YYYY-MM-DD)
 * @returns {Promise<Object>} Informações do clima para o evento
 */
export async function getEventWeather(latitude, longitude, eventDate) {
    try {
        // Calcula quantos dias faltam até o evento
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const eventDateObj = new Date(eventDate);
        eventDateObj.setHours(0, 0, 0, 0);

        const diffTime = eventDateObj - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Se o evento já passou ou é hoje
        if (diffDays < 0) {
            throw new Error("A data do evento já passou");
        }

        // API só prevê até 16 dias
        const forecastDays = Math.min(diffDays + 1, 16);

        // Busca previsão do tempo
        const data = await getWeatherForecast(latitude, longitude, {
            forecastDays,
            hourlyParams: [],
            dailyParams: [
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_sum",
                "precipitation_probability_max",
                "weather_code",
            ],
            currentParams: [],
        });

        // Encontra o índice do dia do evento
        const eventDayIndex = data.daily.time.findIndex((date) => date === eventDate);

        if (eventDayIndex === -1) {
            throw new Error("Data do evento não encontrada na previsão");
        }

        // Extrai informações do dia específico
        const tempMax = data.daily.temperature_2m_max[eventDayIndex];
        const tempMin = data.daily.temperature_2m_min[eventDayIndex];
        const precipitation = data.daily.precipitation_sum[eventDayIndex];
        const precipitationProbability = data.daily.precipitation_probability_max?.[eventDayIndex];
        const weatherCode = data.daily.weather_code[eventDayIndex];
        const weatherDescription = getWeatherDescription(weatherCode);

        // Define se vai chover (precipitação > 0.5mm ou probabilidade > 50%)
        const willRain = precipitation > 0.5 || (precipitationProbability && precipitationProbability > 50);

        return {
            date: eventDate,
            temperature: {
                max: tempMax,
                min: tempMin,
                unit: "°C",
            },
            rain: {
                willRain,
                precipitation: precipitation,
                probability: precipitationProbability,
                unit: "mm",
            },
            weather: {
                code: weatherCode,
                description: weatherDescription.description,
                icon: weatherDescription.icon,
                severity: weatherDescription.severity,
            },
            location: {
                latitude: data.latitude,
                longitude: data.longitude,
            },
        };
    } catch (error) {
        console.error("Erro ao buscar clima do evento:", error);
        throw error;
    }
}

/**
 * Versão simplificada - busca clima por endereço
 * @param {string} address - Endereço do evento
 * @param {string} eventDate - Data do evento (formato: YYYY-MM-DD)
 * @returns {Promise<Object>} Informações do clima para o evento
 */
export async function getEventWeatherByAddress(address, eventDate) {
    // Esta função precisa do geocode, então será usada via hook
    throw new Error("Use o hook useEventWeather para buscar por endereço");
}

export default {
    getWeatherForecast,
    getCurrentWeather,
    getRainForecast,
    getWeatherDescription,
    getWindScale,
    getRainyDays,
    getEventWeather,
};

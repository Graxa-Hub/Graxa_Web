import React from "react";
import { useEventWeather } from "../../hooks/useWeather";

/**
 * Card que mostra o clima do evento
 * Exibe temperatura máxima/mínima e se vai chover
 */
export function EventWeatherCard({ location, eventDate }) {
  const { eventWeather, loading, error } = useEventWeather(location, eventDate);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">⚠️ Erro ao buscar clima: {error}</p>
      </div>
    );
  }

  if (!eventWeather) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        🌤️ Previsão do Clima
      </h3>

      <div className="space-y-3">
        {/* Temperatura */}
        <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-blue-50 p-3 rounded-lg">
          <div className="flex-1">
            <p className="text-xs text-gray-600 mb-1">Temperatura</p>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <span className="text-2xl font-bold text-red-600">
                  {eventWeather.temperature.max}°
                </span>
                <p className="text-xs text-gray-500">Máx</p>
              </div>
              <span className="text-gray-400">/</span>
              <div className="text-center">
                <span className="text-2xl font-bold text-blue-600">
                  {eventWeather.temperature.min}°
                </span>
                <p className="text-xs text-gray-500">Mín</p>
              </div>
            </div>
          </div>
          <div className="text-5xl">{eventWeather.weather.icon}</div>
        </div>

        {/* Chuva */}
        <div
          className={`p-3 rounded-lg border-2 ${
            eventWeather.rain.willRain
              ? "bg-blue-50 border-blue-300"
              : "bg-green-50 border-green-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {eventWeather.rain.willRain
                  ? "⚠️ Previsão de Chuva"
                  : "✅ Sem Chuva"}
              </p>
              {eventWeather.rain.willRain && (
                <div className="text-xs text-gray-600 mt-1">
                  <p>Precipitação: {eventWeather.rain.precipitation}mm</p>
                  {eventWeather.rain.probability && (
                    <p>Probabilidade: {eventWeather.rain.probability}%</p>
                  )}
                </div>
              )}
            </div>
            <div className="text-3xl">
              {eventWeather.rain.willRain ? "🌧️" : "☀️"}
            </div>
          </div>
        </div>

        {/* Descrição do clima */}
        <div className="text-center p-2 bg-gray-50 rounded">
          <p className="text-sm text-gray-700">
            {eventWeather.weather.description}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Versão compacta do card de clima
 * Para usar em espaços menores
 */
export function EventWeatherCompact({ location, eventDate }) {
  const { eventWeather, loading, error } = useEventWeather(location, eventDate);

  if (loading)
    return <span className="text-gray-400">Carregando clima...</span>;
  if (error) return <span className="text-red-500">Erro no clima</span>;
  if (!eventWeather) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-2xl">{eventWeather.weather.icon}</span>
      <div>
        <p className="font-semibold">
          {eventWeather.temperature.max}° / {eventWeather.temperature.min}°
        </p>
        {eventWeather.rain.willRain && (
          <p className="text-blue-600 text-xs">
            🌧️ {eventWeather.rain.precipitation}mm
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Badge simples de chuva (apenas mostra se vai chover ou não)
 */
export function RainBadge({ location, eventDate }) {
  const { eventWeather, loading } = useEventWeather(location, eventDate);

  if (loading) return null;
  if (!eventWeather) return null;

  if (eventWeather.rain.willRain) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
        🌧️ Chuva prevista
      </span>
    );
  }

  return null;
}

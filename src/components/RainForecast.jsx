import { useEffect, useState } from "react";
import { getHourlyForecast } from "../services/weatherService";

/**
 * Componente que mostra apenas os horários com previsão de chuva
 * @param {number} latitude - Latitude do local
 * @param {number} longitude - Longitude do local
 * @param {number} days - Dias de previsão (padrão: 2)
 */
export default function RainForecast({ latitude, longitude, days = 2 }) {
  const [rainHours, setRainHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchRainForecast = async () => {
      setLoading(true);
      setError(null);

      try {
        const forecast = await getHourlyForecast(latitude, longitude, days);

        // Filtra apenas horários com probabilidade de chuva > 0% ou precipitação > 0mm
        const hoursWithRain = forecast.filter(
          (hour) => hour.precipitationProbability > 0 || hour.precipitation > 0
        );

        setRainHours(hoursWithRain);
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar previsão de chuva:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRainForecast();
  }, [latitude, longitude, days]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">Erro ao carregar previsão: {error}</p>
      </div>
    );
  }

  if (rainHours.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <span className="text-4xl mb-2 block">☀️</span>
        <p className="text-green-800 font-medium">Sem previsão de chuva</p>
        <p className="text-green-600 text-sm mt-1">
          Próximos {days} {days === 1 ? "dia" : "dias"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          ☔ Previsão de Chuva
        </h3>
        <span className="text-sm text-gray-500">
          {rainHours.length} {rainHours.length === 1 ? "horário" : "horários"}
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {rainHours.slice(0, 12).map((hour, index) => {
          const date = new Date(hour.time);
          const time = date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const day = date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          });

          // Determina a intensidade da chuva
          const isHeavyRain = hour.precipitation > 5 || hour.precipitationProbability > 70;
          const isModeratRain = hour.precipitation > 2 || hour.precipitationProbability > 40;

          return (
            <div
              key={index}
              className={`flex-shrink-0 rounded-xl p-4 shadow-md min-w-[120px] ${
                isHeavyRain
                  ? "bg-gradient-to-br from-blue-500 to-blue-600"
                  : isModeratRain
                  ? "bg-gradient-to-br from-blue-400 to-blue-500"
                  : "bg-gradient-to-br from-blue-300 to-blue-400"
              } text-white`}
            >
              {/* Horário */}
              <div className="text-center mb-3">
                <div className="text-lg font-bold">{time}</div>
                <div className="text-xs opacity-90">{day}</div>
              </div>

              {/* Ícone do clima */}
              <div className="text-center mb-3">
                <span className="text-3xl">{hour.weatherIcon}</span>
              </div>

              {/* Temperatura */}
              <div className="text-center mb-3">
                <div className="text-2xl font-bold">{Math.round(hour.temperature)}°C</div>
              </div>

              {/* Vento */}
              <div className="flex items-center justify-center gap-1 text-sm">
                <span className="opacity-90">💨</span>
                <span>{Math.round(hour.windSpeed)}km/h</span>
              </div>

              {/* Probabilidade de chuva */}
              {hour.precipitationProbability > 0 && (
                <div className="mt-2 text-center">
                  <div className="text-xs opacity-90">Probabilidade</div>
                  <div className="text-sm font-semibold">
                    {hour.precipitationProbability}%
                  </div>
                </div>
              )}

              {/* Quantidade de chuva */}
              {hour.precipitation > 0 && (
                <div className="mt-2 text-center">
                  <div className="text-xs opacity-90">Precipitação</div>
                  <div className="text-sm font-semibold">
                    {hour.precipitation.toFixed(1)}mm
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {rainHours.length > 12 && (
        <p className="text-sm text-gray-500 text-center">
          Mostrando os primeiros 12 horários • Total: {rainHours.length}
        </p>
      )}
    </div>
  );
}

/**
 * Versão compacta - apenas quantidade de horários com chuva
 */
export function RainAlert({ latitude, longitude, days = 1 }) {
  const [rainCount, setRainCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchRainCount = async () => {
      setLoading(true);
      try {
        const forecast = await getHourlyForecast(latitude, longitude, days);
        const count = forecast.filter((h) => h.precipitationProbability > 30).length;
        setRainCount(count);
      } catch (err) {
        console.error("Erro ao buscar alerta de chuva:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRainCount();
  }, [latitude, longitude, days]);

  if (loading) return null;

  if (rainCount === 0) {
    return (
      <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
        <span>☀️</span>
        <span>Sem chuva prevista</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
      <span>☔</span>
      <span>
        Chuva em {rainCount} {rainCount === 1 ? "horário" : "horários"}
      </span>
    </div>
  );
}

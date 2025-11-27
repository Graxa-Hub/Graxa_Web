import { useState, useEffect } from "react";
import { getCoordinates } from "../utils/endereco/geoUtils";
import { useWeather, useCurrentWeather, useWeatherAnalysis } from "../hooks/useWeather";
import RainForecast, { RainAlert } from "./RainForecast";

/**
 * Componente de exemplo mostrando como usar a API Open-Meteo
 * integrada com o Mapbox para obter coordenadas
 */
export default function WeatherExample() {
  const [endereco, setEndereco] = useState("");
  const [coords, setCoords] = useState(null);
  const [buscando, setBuscando] = useState(false);

  // Hook de clima (só busca quando temos coordenadas)
  const { weather, loading, error, refetch } = useWeather(
    coords?.lat,
    coords?.lon,
    { autoFetch: false, days: 7 }
  );

  const buscarClima = async () => {
    if (!endereco) return;

    setBuscando(true);
    try {
      // 1. Primeiro busca as coordenadas usando Mapbox
      const coordenadas = await getCoordinates(endereco);
      setCoords(coordenadas);

      // 2. Depois busca o clima usando Open-Meteo
      console.log("Coordenadas encontradas:", coordenadas);
    } catch (err) {
      console.error("Erro ao buscar coordenadas:", err);
      alert(err.message);
    } finally {
      setBuscando(false);
    }
  };

  // Busca o clima quando as coordenadas mudam
  useEffect(() => {
    if (coords) {
      refetch();
    }
  }, [coords, refetch]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Exemplo: Clima por Endereço</h1>

      {/* Buscar endereço */}
      <div className="mb-6 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Digite um endereço (ex: São Paulo, SP)"
            className="flex-1 px-4 py-2 border rounded-lg"
            onKeyDown={(e) => e.key === "Enter" && buscarClima()}
          />
          <button
            onClick={buscarClima}
            disabled={buscando || !endereco}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {buscando ? "Buscando..." : "Buscar"}
          </button>
        </div>

        {coords && (
          <div className="text-sm text-gray-600">
            📍 {coords.display_name}
            <br />
            📊 Lat: {coords.lat.toFixed(4)}, Lon: {coords.lon.toFixed(4)}
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando clima...</p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">❌ Erro: {error}</p>
        </div>
      )}

      {/* Resultado */}
      {weather && (
        <div className="space-y-6">
          {/* Clima Atual */}
          {weather.current && (
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Clima Atual</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl mb-2">
                    {weather.current.weatherIcon}
                  </div>
                  <p className="text-lg">{weather.current.weatherDescription}</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold">
                    {weather.current.temperature}°C
                  </div>
                  <p className="text-sm opacity-90">
                    Sensação: {weather.current.feelsLike}°C
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
                <div>
                  <p className="text-sm opacity-75">Umidade</p>
                  <p className="text-lg font-semibold">{weather.current.humidity}%</p>
                </div>
                <div>
                  <p className="text-sm opacity-75">Vento</p>
                  <p className="text-lg font-semibold">{weather.current.windSpeed} km/h</p>
                </div>
                <div>
                  <p className="text-sm opacity-75">Nuvens</p>
                  <p className="text-lg font-semibold">{weather.current.cloudCover}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Previsão dos Próximos Dias */}
          {weather.daily && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Próximos Dias</h2>
              <div className="grid gap-3">
                {weather.daily.slice(0, 5).map((day, index) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{day.weatherIcon}</div>
                      <div>
                        <p className="font-medium">
                          {index === 0
                            ? "Hoje"
                            : new Date(day.date).toLocaleDateString("pt-BR", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              })}
                        </p>
                        <p className="text-sm text-gray-600">{day.weatherDescription}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {day.tempMax}° / {day.tempMin}°
                      </p>
                      {day.precipitationProbability > 0 && (
                        <p className="text-sm text-blue-600">
                          💧 {day.precipitationProbability}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Previsão de Chuva - Apenas horários com chuva */}
          {coords && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <RainForecast 
                latitude={coords.lat} 
                longitude={coords.lon} 
                days={2} 
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Exemplo 2: Componente simples que só mostra clima atual
 */
export function SimpleWeatherDisplay({ latitude, longitude }) {
  const { weather, loading, error } = useCurrentWeather(latitude, longitude);

  if (loading) return <div className="text-gray-500">Carregando clima...</div>;
  if (error) return <div className="text-red-500">Erro: {error}</div>;
  if (!weather) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
      <span className="text-2xl">{weather.weatherIcon}</span>
      <div>
        <p className="font-semibold">{weather.temperature}°C</p>
        <p className="text-xs text-gray-600">{weather.weatherDescription}</p>
      </div>
    </div>
  );
}

/**
 * Exemplo 3: Análise de clima para eventos
 */
export function EventWeatherAnalysis({ latitude, longitude }) {
  const { weather, analysis, loading, error } = useWeatherAnalysis(latitude, longitude);

  if (loading) return <div>Analisando clima...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!analysis) return null;

  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        analysis.favorable
          ? "bg-green-50 border-green-300"
          : "bg-yellow-50 border-yellow-300"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{analysis.favorable ? "✅" : "⚠️"}</div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{analysis.recommendation}</h3>
          <p className="text-sm text-gray-700 mb-2">{analysis.summary}</p>
          {analysis.warnings.length > 0 && (
            <ul className="text-sm space-y-1">
              {analysis.warnings.map((warning, i) => (
                <li key={i} className="text-gray-600">
                  • {warning}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import {
  useCurrentWeather,
  useRainForecast,
  useWeatherForecast,
} from "../hooks/useWeather";

/**
 * Componente de exemplo que demonstra como usar a API Open-Meteo
 * Mostra clima atual, previsão de chuva e previsão completa
 */
export default function WeatherExample() {
  const [location, setLocation] = useState("São Paulo, Brazil");
  const [searchInput, setSearchInput] = useState("São Paulo, Brazil");

  // Hook para clima atual
  const {
    weather: currentWeather,
    loading: loadingCurrent,
    error: errorCurrent,
  } = useCurrentWeather(location);

  // Hook para previsão de chuva (7 dias)
  const {
    forecast: rainForecast,
    loading: loadingRain,
    error: errorRain,
  } = useRainForecast(location, 7);

  // Hook para previsão completa (3 dias)
  const {
    forecast: fullForecast,
    loading: loadingFull,
    error: errorFull,
  } = useWeatherForecast(location, {
    forecastDays: 3,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setLocation(searchInput);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Previsão do Tempo - Open-Meteo API
        </h1>

        {/* Formulário de busca */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Digite um endereço ou cidade..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Buscar
          </button>
        </form>

        <p className="text-sm text-gray-600">
          Localização atual: <span className="font-semibold">{location}</span>
        </p>
      </div>

      {/* Clima Atual */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          ☀️ Clima Atual
        </h2>

        {loadingCurrent && (
          <p className="text-gray-600">Carregando clima atual...</p>
        )}
        {errorCurrent && <p className="text-red-500">Erro: {errorCurrent}</p>}

        {currentWeather && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="text-4xl mb-2">
                {currentWeather.description.icon}
              </div>
              <div className="text-lg font-semibold text-gray-700">
                {currentWeather.description.description}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Temperatura</div>
              <div className="text-3xl font-bold text-gray-800">
                {currentWeather.temperature_2m}°C
              </div>
              <div className="text-xs text-gray-500">
                Sensação: {currentWeather.apparent_temperature}°C
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Umidade</div>
              <div className="text-3xl font-bold text-gray-800">
                {currentWeather.relative_humidity_2m}%
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Vento</div>
              <div className="text-3xl font-bold text-gray-800">
                {currentWeather.wind_speed_10m} km/h
              </div>
              <div className="text-xs text-gray-500">
                {currentWeather.windScale.description}
              </div>
            </div>

            {currentWeather.precipitation > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-200 p-4 rounded-lg col-span-full">
                <div className="text-sm text-gray-600">💧 Precipitação</div>
                <div className="text-2xl font-bold text-gray-800">
                  {currentWeather.precipitation} mm
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Previsão de Chuva */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          🌧️ Previsão de Chuva (7 dias)
        </h2>

        {loadingRain && (
          <p className="text-gray-600">Carregando previsão de chuva...</p>
        )}
        {errorRain && <p className="text-red-500">Erro: {errorRain}</p>}

        {rainForecast && (
          <div className="space-y-4">
            {rainForecast.rainyDays.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold">
                  ✅ Sem previsão de chuva nos próximos 7 dias!
                </p>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 font-semibold">
                    ⚠️ {rainForecast.rainyDays.length} dia(s) com previsão de
                    chuva
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rainForecast.rainyDays.map((day, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200"
                    >
                      <div className="font-semibold text-gray-800">
                        {new Date(day.date).toLocaleDateString("pt-BR", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                      <div className="text-2xl font-bold text-blue-600 mt-2">
                        {day.precipitation} mm
                      </div>
                      {day.probability && (
                        <div className="text-sm text-gray-600 mt-1">
                          Probabilidade: {day.probability}%
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Previsão Completa (3 dias) */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📅 Previsão para os próximos 3 dias
        </h2>

        {loadingFull && <p className="text-gray-600">Carregando previsão...</p>}
        {errorFull && <p className="text-red-500">Erro: {errorFull}</p>}

        {fullForecast?.daily && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fullForecast.daily.time.map((date, index) => {
              const description = fullForecast.daily.descriptions?.[index];
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    description?.severity === "danger"
                      ? "bg-red-50 border-red-300"
                      : description?.severity === "warning"
                      ? "bg-yellow-50 border-yellow-300"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold text-gray-800">
                      {new Date(date).toLocaleDateString("pt-BR", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                    <div className="text-5xl my-3">
                      {description?.icon || "❓"}
                    </div>
                    <div className="text-sm text-gray-700 mb-2">
                      {description?.description || "Desconhecido"}
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Máx:</span>
                        <span className="font-semibold text-red-600">
                          {fullForecast.daily.temperature_2m_max[index]}°C
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mín:</span>
                        <span className="font-semibold text-blue-600">
                          {fullForecast.daily.temperature_2m_min[index]}°C
                        </span>
                      </div>
                      {fullForecast.daily.precipitation_sum[index] > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Chuva:</span>
                          <span className="font-semibold text-blue-600">
                            {fullForecast.daily.precipitation_sum[index]} mm
                          </span>
                        </div>
                      )}
                      {fullForecast.daily.precipitation_probability_max?.[
                        index
                      ] && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Prob.:</span>
                          <span className="font-semibold">
                            {
                              fullForecast.daily.precipitation_probability_max[
                                index
                              ]
                            }
                            %
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Informações da API */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          📚 Sobre a API Open-Meteo
        </h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>✅ API gratuita para uso não comercial</li>
          <li>✅ Não requer autenticação</li>
          <li>✅ Previsão de até 16 dias</li>
          <li>✅ Dados horários e diários</li>
          <li>✅ Combina múltiplos modelos meteorológicos</li>
        </ul>
        <a
          href="https://open-meteo.com/en/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 text-sm mt-2 inline-block"
        >
          📖 Documentação completa →
        </a>
      </div>
    </div>
  );
}

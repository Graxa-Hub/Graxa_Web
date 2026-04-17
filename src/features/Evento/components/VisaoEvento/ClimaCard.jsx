import {
  useHourlyWeather,
  useHourlyWeatherByCoords,
} from "../../../../hooks/useWeather";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
  MapPin,
} from "lucide-react";
import { getWeatherDescription } from "../../../../services/weatherService";

// Mapeia código WMO para ícone do Lucide
const getWeatherIcon = (weatherCode) => {
  if (weatherCode === 0) return Sun;
  if (weatherCode >= 1 && weatherCode <= 3) return Cloud;
  if (weatherCode >= 45 && weatherCode <= 48) return CloudFog;
  if (weatherCode >= 51 && weatherCode <= 57) return CloudDrizzle;
  if (weatherCode >= 61 && weatherCode <= 67) return CloudRain;
  if (weatherCode >= 71 && weatherCode <= 77) return CloudSnow;
  if (weatherCode >= 80 && weatherCode <= 82) return CloudRain;
  if (weatherCode >= 85 && weatherCode <= 86) return CloudSnow;
  if (weatherCode >= 95 && weatherCode <= 99) return CloudRain;
  return Cloud;
};

const getIconColor = (weatherCode) => {
  if (weatherCode === 0) return "text-yellow-500";
  if (weatherCode >= 61 && weatherCode <= 82) return "text-[var(--info)]";
  if (weatherCode >= 71 && weatherCode <= 86) return "text-cyan-400";
  if (weatherCode >= 95) return "text-purple-600";
  return "text-[var(--text-muted)]";
};

export const ClimaCard = ({ cidade = "São Paulo", lat, lon }) => {
  // Tenta usar coordenadas se disponíveis, senão usa a cidade
  const { hourlyWeather, loading, error } =
    lat !== undefined && lon !== undefined
      ? useHourlyWeatherByCoords(lat, lon, 5)
      : useHourlyWeather(cidade, 5);

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
          <h4 className="text-xs font-semibold text-[var(--text-muted)]">
            Carregando clima...
          </h4>
        </div>
        <div className="flex w-full flex-row items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex h-48 min-w-0 flex-1 flex-col items-center justify-between rounded-[var(--radius-sm)] bg-[var(--surface-elevated)] p-3 animate-pulse"
            >
              <div className="h-4 bg-[var(--surface-hover)] rounded w-12 mb-2"></div>
              <div className="h-9 bg-[var(--surface-hover)] rounded-full w-9 mb-2"></div>
              <div className="h-6 bg-[var(--surface-hover)] rounded w-11"></div>
              <div className="h-3 bg-[var(--surface-hover)] rounded w-14 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        {/* <div className="flex items-center gap-1.5 mb-3">
          <MapPin className="w-4 h-4 text-red-400" />
          <h4 className="text-xs font-semibold text-[var(--accent)]">{cidade}</h4>
        </div> */}
        <div className="flex w-full flex-row items-center gap-2">
          <div className="flex h-36 w-full flex-col items-center justify-center rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] p-3">
            <p className="text-xs text-[var(--accent)] text-center">
              Erro no clima
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hourlyWeather) return null;

  // Monta array com: tempo atual + próximas 2 horas
  const weatherCards = [
    {
      label: "Agora",
      temp: Math.round(hourlyWeather.current.temperature_2m),
      weatherCode: hourlyWeather.current.weather_code,
      precipitation: hourlyWeather.current.precipitation,
    },
    // Próxima hora (índice 0)
    {
      label: new Date(hourlyWeather.hours[0]?.time).toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
      temp: Math.round(hourlyWeather.hours[0]?.temperature),
      weatherCode: hourlyWeather.hours[0]?.weatherCode,
      precipitation: hourlyWeather.hours[0]?.precipitation,
    },
    // Daqui a 3 horas (índice 2)
    {
      label: new Date(hourlyWeather.hours[2]?.time).toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
        },
      ),
      temp: Math.round(hourlyWeather.hours[2]?.temperature),
      weatherCode: hourlyWeather.hours[2]?.weatherCode,
      precipitation: hourlyWeather.hours[2]?.precipitation,
    },
  ];

  return (
    <div className="w-full">
      {/* Título com o nome da cidade */}
      {/* <div className="flex items-center gap-1.5 mb-3">
        <MapPin className="w-4 h-4 text-[var(--info)]" />
        <h4 className="text-xs font-semibold text-[var(--text-secondary)]">{cidade}</h4>
      </div> */}

      {/* Cards de clima */}
      <div className="flex w-full flex-row items-stretch gap-2 px-1 overflow-visible">
        {weatherCards.map((card, index) => {
          const WeatherIcon = getWeatherIcon(card.weatherCode);
          const iconColor = getIconColor(card.weatherCode);
          const description = getWeatherDescription(card.weatherCode);

          return (
            <div
              key={index}
              className="flex h-48 min-w-0 flex-1 flex-col items-center rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-soft)] overflow-visible transition-all"
            >
              {/* Topo - Label */}
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] whitespace-nowrap mb-1">
                {card.label}
              </h3>

              {/* Meio - Icone e Temp Principal (Centralizado) */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <WeatherIcon className={`${iconColor} mb-1`} size={32} />
                <p className="text-xl font-bold text-[var(--text-primary)] leading-none">
                  {card.temp}°C
                </p>
              </div>

              {/* Base - Max/Min e Precipitação (Altura Fixa) */}
              <div className="flex flex-col items-center justify-end h-10 w-full mt-1 border-t border-gray-50 pt-1">
                {hourlyWeather.daily && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-[var(--accent)] font-semibold">
                      ↑{Math.round(hourlyWeather.daily.tempMax)}°
                    </span>
                    <span className="text-[var(--info)] font-semibold">
                      ↓{Math.round(hourlyWeather.daily.tempMin)}°
                    </span>
                  </div>
                )}

                {card.precipitation > 0 ? (
                  <p className="text-[10px] text-[var(--info)] font-medium">
                    💧 {card.precipitation}mm
                  </p>
                ) : (
                  <div
                    className="h-[12px]" /* Spacer para manter o alinhamento */
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

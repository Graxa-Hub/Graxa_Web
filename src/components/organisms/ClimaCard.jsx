import {
  useHourlyWeather,
  useHourlyWeatherByCoords,
} from "../../hooks/useWeather";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudRain,
  CloudSnow,
  MapPin,
  Sun,
} from "lucide-react";

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

export const ClimaCard = ({ cidade = "Sao Paulo", lat, lon }) => {
  const { hourlyWeather, loading, error } =
    lat !== undefined && lon !== undefined
      ? useHourlyWeatherByCoords(lat, lon, 5)
      : useHourlyWeather(cidade, 5);

  if (loading) {
    return (
      <div className="w-full">
        <div className="mb-3 flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-[var(--text-muted)]" />
          <h4 className="text-xs font-semibold text-[var(--text-muted)]">
            Carregando clima...
          </h4>
        </div>
        <div className="flex w-full flex-row items-center gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex h-48 min-w-0 flex-1 animate-pulse flex-col items-center justify-between rounded-[var(--radius-sm)] bg-[var(--surface-elevated)] p-3"
            >
              <div className="mb-2 h-4 w-12 rounded bg-[var(--surface-hover)]" />
              <div className="mb-2 h-9 w-9 rounded-full bg-[var(--surface-hover)]" />
              <div className="h-6 w-11 rounded bg-[var(--surface-hover)]" />
              <div className="mt-2 h-3 w-14 rounded bg-[var(--surface-hover)]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex w-full flex-row items-center gap-2">
          <div className="flex h-36 w-full flex-col items-center justify-center rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] p-3">
            <p className="text-center text-xs text-[var(--accent)]">
              Erro no clima
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!hourlyWeather) return null;

  const weatherCards = [
    {
      label: "Agora",
      temp: Math.round(hourlyWeather.current.temperature_2m),
      weatherCode: hourlyWeather.current.weather_code,
      precipitation: hourlyWeather.current.precipitation,
    },
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
      <div className="flex w-full flex-row items-stretch gap-2 overflow-visible px-1">
        {weatherCards.map((card, index) => {
          const WeatherIcon = getWeatherIcon(card.weatherCode);
          const iconColor = getIconColor(card.weatherCode);

          return (
            <div
              key={index}
              className="flex h-48 min-w-0 flex-1 flex-col items-center overflow-visible rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] p-3 shadow-[var(--shadow-soft)] transition-all"
            >
              <h3 className="mb-1 whitespace-nowrap text-sm font-semibold text-[var(--text-secondary)]">
                {card.label}
              </h3>

              <div className="flex flex-1 flex-col items-center justify-center">
                <WeatherIcon className={`${iconColor} mb-1`} size={32} />
                <p className="text-xl font-bold leading-none text-[var(--text-primary)]">
                  {card.temp}°C
                </p>
              </div>

              <div className="mt-1 flex h-10 w-full flex-col items-center justify-end border-t border-gray-50 pt-1">
                {hourlyWeather.daily && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="font-semibold text-[var(--accent)]">
                      ↑{Math.round(hourlyWeather.daily.tempMax)}°
                    </span>
                    <span className="font-semibold text-[var(--info)]">
                      ↓{Math.round(hourlyWeather.daily.tempMin)}°
                    </span>
                  </div>
                )}

                {card.precipitation > 0 ? (
                  <p className="text-[10px] font-medium text-[var(--info)]">
                    💧 {card.precipitation}mm
                  </p>
                ) : (
                  <div className="h-[12px]" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

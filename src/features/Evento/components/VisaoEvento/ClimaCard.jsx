import { useHourlyWeather, useHourlyWeatherByCoords } from "../../../../hooks/useWeather";
import { Cloud, CloudRain, Sun, CloudSnow, CloudDrizzle, CloudFog } from "lucide-react";
import { getWeatherDescription } from "../../../../services/weatherService";

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
  if (weatherCode === 0) return "text-[var(--warning)]";
  if (weatherCode >= 61 && weatherCode <= 82) return "text-[var(--info)]";
  if (weatherCode >= 71 && weatherCode <= 86) return "text-cyan-400";
  if (weatherCode >= 95) return "text-purple-400";
  return "text-[var(--text-muted)]";
};

export const ClimaCard = ({ cidade = "São Paulo", lat, lon }) => {
  const hourlyByCoords = useHourlyWeatherByCoords(lat, lon, 5);
  const hourlyByCity = useHourlyWeather(cidade, 5);
  const { hourlyWeather, loading, error } = lat !== undefined && lon !== undefined ? hourlyByCoords : hourlyByCity;

  if (loading) {
    return (
      <div className="w-full flex flex-row items-center justify-end gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-between bg-[var(--surface)] border border-[var(--border)] h-48 w-[100px] p-3 rounded-[var(--radius-md)] animate-pulse"
          >
            <div className="h-4 bg-[var(--border)] rounded w-12 mb-2"></div>
            <div className="h-9 bg-[var(--border)] rounded-full w-9 mb-2"></div>
            <div className="h-6 bg-[var(--border)] rounded w-11"></div>
            <div className="h-3 bg-[var(--border)] rounded w-14 mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-row items-center justify-end gap-2">
        <div className="flex flex-col items-center justify-center bg-[var(--surface)] border border-[var(--border)] h-36 w-[100px] p-3 rounded-[var(--radius-md)]">
          <p className="text-xs text-[var(--accent)] text-center">Erro no clima</p>
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
      label: new Date(hourlyWeather.hours[0]?.time).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      temp: Math.round(hourlyWeather.hours[0]?.temperature),
      weatherCode: hourlyWeather.hours[0]?.weatherCode,
      precipitation: hourlyWeather.hours[0]?.precipitation,
    },
    {
      label: new Date(hourlyWeather.hours[2]?.time).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      temp: Math.round(hourlyWeather.hours[2]?.temperature),
      weatherCode: hourlyWeather.hours[2]?.weatherCode,
      precipitation: hourlyWeather.hours[2]?.precipitation,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-end gap-2 px-1 overflow-visible">
        {weatherCards.map((card, index) => {
          const WeatherIcon = getWeatherIcon(card.weatherCode);
          const iconColor = getIconColor(card.weatherCode);
          const description = getWeatherDescription(card.weatherCode);

          return (
            <div
              key={index}
              title={description}
              className="flex flex-col items-center bg-[var(--surface)] border border-[var(--border)] h-48 w-[100px] p-3 rounded-[var(--radius-md)] shadow-[var(--shadow-soft)] overflow-visible transition-all"
            >
              <h3 className="text-sm font-semibold text-[var(--text-primary)] whitespace-nowrap mb-1">{card.label}</h3>
              <div className="flex-1 flex flex-col items-center justify-center">
                <WeatherIcon className={`${iconColor} mb-1`} size={32} />
                <p className="text-xl font-bold text-[var(--text-primary)] leading-none">{card.temp}°C</p>
              </div>
              <div className="flex flex-col items-center justify-end h-10 w-full mt-1 border-t border-[var(--border)] pt-1">
                {hourlyWeather.daily && (
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-[var(--accent)] font-semibold">↑{Math.round(hourlyWeather.daily.tempMax)}°</span>
                    <span className="text-[var(--info)] font-semibold">↓{Math.round(hourlyWeather.daily.tempMin)}°</span>
                  </div>
                )}
                {card.precipitation > 0 ? (
                  <p className="text-[10px] text-[var(--info)] font-medium">💧 {card.precipitation}mm</p>
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

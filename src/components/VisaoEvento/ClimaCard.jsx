import { useHourlyWeather } from "../../hooks/useWeather";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  CloudDrizzle,
  CloudFog,
} from "lucide-react";
import { getWeatherDescription } from "../../services/weatherService";

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
  if (weatherCode >= 61 && weatherCode <= 82) return "text-blue-500";
  if (weatherCode >= 71 && weatherCode <= 86) return "text-cyan-400";
  if (weatherCode >= 95) return "text-purple-600";
  return "text-gray-500";
};

export const ClimaCard = ({ cidade = "São Paulo" }) => {
  const { hourlyWeather, loading, error } = useHourlyWeather(cidade, 3);

  if (loading) {
    return (
      <div className="w-full flex flex-row items-center justify-end gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-between bg-white h-36 w-[100px] p-3 rounded-xl animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-12 mb-2"></div>
            <div className="h-9 bg-gray-200 rounded-full w-9 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-11"></div>
            <div className="h-3 bg-gray-200 rounded w-14 mt-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex flex-row items-center justify-end gap-2">
        <div className="flex flex-col items-center justify-center bg-white h-36 w-[100px] p-3 rounded-xl">
          <p className="text-xs text-red-500 text-center">Erro no clima</p>
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
    ...hourlyWeather.hours.slice(1, 3).map((hour, idx) => ({
      label: new Date(hour.time).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: Math.round(hour.temperature),
      weatherCode: hour.weatherCode,
      precipitation: hour.precipitation,
    })),
  ];

  return (
    <div className="w-full flex flex-row items-center justify-end gap-2">
      {weatherCards.map((card, index) => {
        const WeatherIcon = getWeatherIcon(card.weatherCode);
        const iconColor = getIconColor(card.weatherCode);
        const description = getWeatherDescription(card.weatherCode);

        return (
          <div
            key={index}
            className="flex flex-col items-center justify-between bg-white h-36 w-[100px] p-3 rounded-xl shadow-md"
          >
            <h3 className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              {card.label}
            </h3>
            <WeatherIcon className={`${iconColor} my-1`} size={32} />
            <p className="text-xl font-bold text-gray-800">{card.temp}°C</p>

            {/* Temperatura máxima e mínima */}
            {hourlyWeather.daily && (
              <div className="flex items-center gap-1.5 text-[11px] mt-1">
                <span className="text-red-500 font-semibold">
                  ↑{Math.round(hourlyWeather.daily.tempMax)}°
                </span>
                <span className="text-blue-500 font-semibold">
                  ↓{Math.round(hourlyWeather.daily.tempMin)}°
                </span>
              </div>
            )}

            {card.precipitation > 0 && (
              <p className="text-[10px] text-blue-600 mt-0.5">
                💧 {card.precipitation}mm
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

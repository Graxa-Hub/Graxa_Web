# 🌤️ Implementação da API Open-Meteo

## Arquivos Criados

### 1. **weatherService.js** (`src/services/weatherService.js`)

Serviço completo para interagir com a API Open-Meteo:

**Funções disponíveis:**

- `getWeatherForecast(lat, lon, options)` - Previsão completa customizável
- `getCurrentWeather(lat, lon)` - Condições climáticas atuais
- `getRainForecast(lat, lon, days)` - Previsão específica de chuva
- `getWeatherDescription(code)` - Interpreta códigos WMO do clima
- `getWindScale(windSpeed)` - Escala Beaufort para vento
- `getRainyDays(dailyData)` - Identifica dias com chuva

### 2. **useWeather.js** (`src/hooks/useWeather.js`)

Hooks React para facilitar o uso da API:

**Hooks disponíveis:**

- `useCurrentWeather(location)` - Clima atual por endereço
- `useRainForecast(location, days)` - Previsão de chuva
- `useWeatherForecast(location, options)` - Previsão completa
- `useWeatherByCoords(lat, lon)` - Clima por coordenadas diretas

### 3. **WeatherExample.jsx** (`src/components/WeatherExample.jsx`)

Componente de demonstração completo com:

- ☀️ Clima atual (temperatura, umidade, vento)
- 🌧️ Previsão de chuva para 7 dias
- 📅 Previsão completa para 3 dias
- 🔍 Busca por endereço/cidade

## Como Usar

### Exemplo 1: Clima Atual

\`\`\`javascript
import { useCurrentWeather } from './hooks/useWeather';

function MeuComponente() {
const { weather, loading, error } = useCurrentWeather("São Paulo, Brazil");

if (loading) return <p>Carregando...</p>;
if (error) return <p>Erro: {error}</p>;

return (
<div>
<h2>{weather.description.description} {weather.description.icon}</h2>
<p>Temperatura: {weather.temperature_2m}°C</p>
<p>Umidade: {weather.relative_humidity_2m}%</p>
</div>
);
}
\`\`\`

### Exemplo 2: Previsão de Chuva

\`\`\`javascript
import { useRainForecast } from './hooks/useWeather';

function PrevisaoChuva() {
const { forecast, loading } = useRainForecast("Rio de Janeiro", 7);

return (
<div>
{forecast?.rainyDays.length === 0 ? (
<p>✅ Sem chuva prevista!</p>
) : (
<ul>
{forecast.rainyDays.map(day => (
<li key={day.date}>
{day.date}: {day.precipitation}mm ({day.probability}%)
</li>
))}
</ul>
)}
</div>
);
}
\`\`\`

### Exemplo 3: Integração com Mapbox

\`\`\`javascript
import { getWeatherForecast } from './services/weatherService';
import { geocode } from './services/directions';

async function buscarClimaPorEndereco(endereco) {
// 1. Converte endereço em coordenadas (usando Mapbox)
const coords = await geocode(endereco);

// 2. Busca clima com as coordenadas
const weather = await getWeatherForecast(coords.lat, coords.lon, {
forecastDays: 7,
hourlyParams: ['temperature_2m', 'precipitation'],
dailyParams: ['temperature_2m_max', 'temperature_2m_min', 'precipitation_sum']
});

return weather;
}
\`\`\`

## Testando

Acesse a rota: **`/weather-example`**

Ou adicione ao seu código:
\`\`\`jsx
import WeatherExample from './components/WeatherExample';

<Route path="/weather-example" element={<WeatherExample />} />
\`\`\`

## Recursos da API

✅ **Gratuita** para uso não comercial (até 10.000 chamadas/dia)  
✅ **Sem autenticação** necessária  
✅ **Previsão de até 16 dias**  
✅ **Dados horários, diários e atuais**  
✅ **Múltiplos modelos meteorológicos** combinados  
✅ **Sem CORS** - funciona direto do navegador

## Variáveis Disponíveis

### Horárias

- Temperatura, umidade, pressão
- Precipitação, chuva, neve
- Vento (velocidade, direção, rajadas)
- Radiação solar
- Código do clima (WMO)

### Diárias

- Temperaturas máxima/mínima
- Soma de precipitação
- Probabilidade de chuva
- Nascer/pôr do sol
- UV Index

### Atuais

- Todas as variáveis horárias disponíveis
- Atualizado a cada 15 minutos

## Códigos WMO de Clima

| Código | Descrição  | Ícone |
| ------ | ---------- | ----- |
| 0      | Céu limpo  | ☀️    |
| 1-3    | Nublado    | ⛅    |
| 45-48  | Neblina    | 🌫️    |
| 51-57  | Garoa      | 🌦️    |
| 61-67  | Chuva      | 🌧️    |
| 71-77  | Neve       | 🌨️    |
| 80-82  | Pancadas   | ⛈️    |
| 95-99  | Tempestade | ⛈️    |

## Documentação Completa

[https://open-meteo.com/en/docs](https://open-meteo.com/en/docs)

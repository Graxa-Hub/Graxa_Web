# 🌤️ Como Usar o Clima no VisaoEvento

## Opções de Uso

Você tem **3 formas** de usar as informações de clima no seu `/visao-evento`:

---

## 1️⃣ **Usar o Hook Diretamente** (Recomendado)

### No seu componente VisaoEvento:

```jsx
import { useEventWeather } from "../hooks/useWeather";

export const VisaoEvento = ({ evento }) => {
  // Busca clima do evento
  const { eventWeather, loading, error } = useEventWeather(
    "São Paulo, Brazil", // Endereço do evento
    "2025-12-15" // Data do evento (YYYY-MM-DD)
  );

  return (
    <Layout>
      {/* Seu código existente */}

      {/* Mostra temperatura */}
      {eventWeather && (
        <div>
          <p>Temp Máxima: {eventWeather.temperature.max}°C</p>
          <p>Temp Mínima: {eventWeather.temperature.min}°C</p>
          <p>Vai chover? {eventWeather.rain.willRain ? "Sim 🌧️" : "Não ☀️"}</p>
        </div>
      )}
    </Layout>
  );
};
```

### **Dados Retornados:**

```javascript
{
  date: "2025-12-15",
  temperature: {
    max: 28,      // Temperatura máxima
    min: 18,      // Temperatura mínima
    unit: "°C"
  },
  rain: {
    willRain: true,           // true se vai chover
    precipitation: 5.2,       // mm de chuva
    probability: 80,          // % de chance
    unit: "mm"
  },
  weather: {
    code: 61,
    description: "Chuva leve",
    icon: "🌧️",
    severity: "moderate"
  }
}
```

---

## 2️⃣ **Usar o Componente Pronto** (Mais Fácil)

Já criei **3 componentes** prontos para você usar:

### A) Card Completo:

```jsx
import { EventWeatherCard } from "../components/VisaoEvento/EventWeatherCard";

<EventWeatherCard location="São Paulo, Brazil" eventDate="2025-12-15" />;
```

➡️ Mostra card completo com temperatura e chuva

### B) Versão Compacta:

```jsx
import { EventWeatherCompact } from "../components/VisaoEvento/EventWeatherCard";

<EventWeatherCompact location="São Paulo, Brazil" eventDate="2025-12-15" />;
```

➡️ Versão pequena, ideal para listagens

### C) Badge de Chuva:

```jsx
import { RainBadge } from "../components/VisaoEvento/EventWeatherCard";

<RainBadge location="São Paulo, Brazil" eventDate="2025-12-15" />;
```

➡️ Mostra apenas "🌧️ Chuva prevista" se for chover

---

## 3️⃣ **Buscar por Coordenadas** (Se já tiver lat/lon)

Se você já tem latitude e longitude do banco:

```jsx
import { useEventWeatherByCoords } from "../hooks/useWeather";

const { eventWeather } = useEventWeatherByCoords(
  -23.5505, // latitude
  -46.6333, // longitude
  "2025-12-15"
);
```

---

## 📋 Exemplo Completo no VisaoEvento

```jsx
import React from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { EventWeatherCard } from "../components/VisaoEvento/EventWeatherCard";
import { useEventWeather } from "../hooks/useWeather";

export const VisaoEvento = ({ evento }) => {
  // Se vier do backend
  const eventoLocal = evento?.local || "São Paulo, SP";
  const eventoData = evento?.data || "2025-12-15";

  // Busca clima
  const { eventWeather, loading } = useEventWeather(eventoLocal, eventoData);

  return (
    <Layout>
      <Sidebar />

      <div className="grid grid-cols-2 gap-4 p-4">
        {/* Seus cards existentes */}
        <MapCard />
        <AgendaCard />

        {/* Card de Clima */}
        <EventWeatherCard location={eventoLocal} eventDate={eventoData} />

        {/* Ou use os dados direto */}
        {eventWeather && (
          <div className="bg-white p-4 rounded-lg">
            <h3>Informações do Clima</h3>
            <p>
              🌡️ {eventWeather.temperature.max}° /{" "}
              {eventWeather.temperature.min}°
            </p>
            {eventWeather.rain.willRain && (
              <p className="text-blue-600">
                ⚠️ Atenção: Previsão de {eventWeather.rain.precipitation}mm de
                chuva!
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};
```

---

## 🎯 Casos de Uso Práticos

### 1. Mostrar alerta se vai chover:

```jsx
{
  eventWeather?.rain.willRain && (
    <div className="bg-yellow-100 border border-yellow-400 p-3 rounded">
      ⚠️ Atenção! Previsão de chuva para este evento.
      <br />
      Precipitação esperada: {eventWeather.rain.precipitation}mm
    </div>
  );
}
```

### 2. Adaptar recomendações baseado na temperatura:

```jsx
{
  eventWeather && (
    <div>
      {eventWeather.temperature.max > 30 && (
        <p>🥵 Dia quente! Lembre-se de levar água.</p>
      )}
      {eventWeather.temperature.min < 15 && (
        <p>🥶 Noite fria! Leve um casaco.</p>
      )}
    </div>
  );
}
```

### 3. Badge de status no card do evento:

```jsx
<div className="event-card">
  <h3>{evento.nome}</h3>
  <RainBadge location={evento.local} eventDate={evento.data} />
</div>
```

---

## ⚙️ Observações Importantes

1. **Data do Evento**: Formato obrigatório `YYYY-MM-DD` (ex: `2025-12-15`)
2. **Limite de Previsão**: API só prevê até **16 dias** no futuro
3. **Critério de Chuva**:
   - `willRain = true` se precipitação > 0.5mm OU probabilidade > 50%
4. **Performance**: O hook já tem cache automático por data/local

---

## 🔧 Integração com Backend

Se seus eventos vierem do backend:

```jsx
const { eventWeather } = useEventWeather(
  evento.endereco_completo, // Campo do banco
  evento.data_evento // Campo do banco (formato ISO)
);
```

---

## 📝 Resumo Rápido

**Para usar no VisaoEvento:**

✅ **Jeito mais fácil**: Importar `<EventWeatherCard />` e pronto!  
✅ **Customizado**: Usar hook `useEventWeather()` e criar seu próprio layout  
✅ **Badge simples**: Usar `<RainBadge />` para mostrar só se vai chover

**Informações disponíveis:**

- ✅ Temperatura máxima
- ✅ Temperatura mínima
- ✅ Se vai chover (true/false)
- ✅ Quantidade de chuva (mm)
- ✅ Probabilidade de chuva (%)
- ✅ Descrição do clima
- ✅ Ícone visual

---

Qualquer dúvida, é só chamar! 🚀

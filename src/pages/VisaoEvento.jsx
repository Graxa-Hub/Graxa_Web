import React from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { BandaDropdown } from "../components/BandaDropdown";
import { MapPin, Circle, CircleDot, Clock, Sun, Wind } from "lucide-react";

// ===== Componente de Card do Cronograma =====
const ScheduleCard = ({ time, title, description, active }) => (
  <div
    className={`flex items-start gap-4 bg-white rounded-2xl shadow-md p-4 border ${
      active ? "border-red-500 ring-1 ring-red-300" : "border-gray-200"
    }`}
  >
    <div className="text-center w-20">
      <p className="text-xs font-bold text-gray-700">{time}</p>
      <p className="text-[10px] text-gray-500">April, 08</p>
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        {active ? (
          <CircleDot className="text-red-500 w-3 h-3" />
        ) : (
          <Circle className="text-gray-400 w-3 h-3" />
        )}
        <h3
          className={`font-semibold text-sm ${
            active ? "text-red-600" : "text-gray-800"
          }`}
        >
          {title}
        </h3>
      </div>
      <p className="text-xs text-gray-500 mt-2 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

// ===== Card de Clima =====
const WeatherCard = ({ time, temp, wind }) => (
  <div className="bg-white rounded-xl shadow-sm text-center p-3 flex flex-col items-center justify-between">
    <p className="text-xs text-gray-500">{time}</p>
    <Sun className="text-yellow-500 w-5 h-5" />
    <p className="text-sm font-semibold text-gray-700">{temp}</p>
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <Wind className="w-3 h-3" /> {wind}
    </div>
  </div>
);

// ===== Componente de Progresso =====
const ProgressCard = ({ percent }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center">
    <p className="text-sm text-gray-600 mb-2 text-center leading-tight">
      Progresso do cronograma <br /> % Realizada
    </p>
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="#16a34a"
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${(percent / 100) * 226} 226`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-semibold text-gray-700">
        {percent}%
      </span>
    </div>
  </div>
);

// ===== Card do Mapa =====
const MapCard = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
    <img
      src="https://maps.googleapis.com/maps/api/staticmap?center=-23.5505,-46.6333&zoom=12&size=600x300&markers=color:red%7C-23.5631,-46.6544&markers=color:red%7C-23.5565,-46.6621&key=AIzaSyExample"
      alt="Mapa do evento"
      className="w-full h-64 object-cover"
    />
    <div className="p-3 text-sm text-gray-700 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <CircleDot className="text-red-500 w-3 h-3" />
        <span className="font-medium">Transporte até o evento</span>
      </div>
      <p className="text-xs text-gray-500">
        Distância: <b>4,4 km</b> &nbsp; | &nbsp; Tempo Estimado:{" "}
        <b>43 minutos</b>
      </p>
    </div>
  </div>
);

// ===== Página Principal =====
export const VisaoEvento = () => {
  const schedule = [
    {
      time: "12:00 AM",
      title: "Transporte até o evento",
      description:
        "Van irá sair do Hotel às 12:00 com previsão de chegada às 12:45",
      active: true,
    },
    {
      time: "12:45 AM",
      title: "Descarregar a Van",
      description:
        "Please add your content here. Keep it short and simple. And smile :)",
    },
    {
      time: "1:00 AM",
      title: "Montagem do palco",
      description:
        "Please add your content here. Keep it short and simple. And smile :)",
    },
    {
      time: "1:30 AM",
      title: "Passagem de som",
      description:
        "Please add your content here. Keep it short and simple. And smile :)",
    },
    {
      time: "3:30 PM",
      title: "Descanso",
      description:
        "Please add your content here. Keep it short and simple. And smile :)",
    },
    {
      time: "6:00 PM",
      title: "Entrar no palco",
      description:
        "Please add your content here. Keep it short and simple. And smile :)",
    },
  ];

  const weathers = [
    { time: "15:00", temp: "26°C", wind: "3km/h" },
    { time: "18:00", temp: "26°C", wind: "3km/h" },
    { time: "21:00", temp: "26°C", wind: "3km/h" },
  ];

  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 min-h-screen bg-[#e7f0d9] p-8 flex flex-col">
        {/* Topo */}
        <div className="flex items-center justify-between mb-6">
          <BandaDropdown
            bands={["Boogarins", "Planet Hemp"]}
            selectedBand="Boogarins"
            onBandSelect={() => {}}
          />
          <div className="bg-white rounded-lg shadow-sm p-3">
            <p className="text-xs text-gray-500">Dia de Show</p>
            <p className="text-sm font-medium text-gray-700">
              29-10-2025, São Paulo → São Paulo
            </p>
          </div>
        </div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 flex-1">
          {/* Cards de Cronograma */}
          <div className="space-y-3 overflow-y-auto pr-2 max-h-[80vh]">
            {schedule.map((item, index) => (
              <ScheduleCard key={index} {...item} />
            ))}
          </div>

          {/* Lado direito */}
          <div className="flex flex-col gap-4">
            <MapCard />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProgressCard percent={10} />
              <div className="grid grid-cols-3 gap-3">
                {weathers.map((w, i) => (
                  <WeatherCard key={i} {...w} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

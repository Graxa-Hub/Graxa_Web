import React from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { MapCard } from "../components/visaoGeral/MapCard";
import { Porcentagem } from "../components/visaoGeral/Porcentagem";
import { AgendaCard } from "../components/visaoGeral/AgendaCard";
import { ClimaCard } from "../components/visaoGeral/ClimaCard";
// import { Header } from "../components/Dashboard/Header";
// import { Container } from "../components/Dashboard/Container";

// ===== Página Principal =====
export const VisaoEvento = () => {
  const agenda = [
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

  return (
    <Layout>
      <Sidebar />
      <div className="grid grid-cols-2 max-h-screen w-full overflow-hidden p-2 bg-blue-100 gap-2">
        <main className="flex flex-col p-5 bg-red-100 min-h-0 w-full">
          a<header>Oi</header>
          {/* <Header
          titulo="Boogarins"
          turne="The Town 2025"
          circulo="bg-green-500"
        /> */}
        </main>

        <aside className="flex flex-col flex-rows-2 justify-between">
          <MapCard />
          <div className="flex flex-row justify-between">
            <Porcentagem />
            <ClimaCard />
          </div>
        </aside>
      </div>
      {/* Cabeçalho da main */}

      {/* Substituir esse bloco para <Container/> */}
      <div className="flex-1 w-full rounded-lg overflow-auto min-h-0 ">
        <div className="flex h-full justify-between cols cols-2 sm:cols-1 gap-3">
          {/* <MapCard /> */}
          {/* <Porcentagem /> */}
          {/* <AgendaCard /> */}
        </div>
      </div>
      {/* <main className="flex-1 min-h-screen bg-[#e7f0d9] p-8 flex flex-col">
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

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6 flex-1">
          <div className="space-y-3 overflow-y-auto pr-2 max-h-[80vh]">
            {schedule.map((item, index) => (
              <ScheduleCard key={index} {...item} />
            ))}
          </div>

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
      </main> */}
    </Layout>
  );
};

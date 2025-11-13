import React from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { MapCard } from "../components/VisaoEvento/MapCard";
import { Porcentagem } from "../components/VisaoEvento/Porcentagem";
import { AgendaCard } from "../components/VisaoEvento/AgendaCard";
import { ClimaCard } from "../components/VisaoEvento/ClimaCard";
import { Header } from "../components/Dashboard/Header";
import { DiaInfoCard } from "../components/VisaoEvento/DiaInfoCard";
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
    {
      time: "6:00 PM",
      title: "Entrar no palco",
      description:
        "Please add your content here. Keep it short and simple. And smile :)",
    },
    {
      time: "6:00 PM",
      title: "Entrar no palco",
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
      <div className="grid grid-rows-[auto_1fr] grid-cols-2 max-h-screen w-full overflow-hidden p-4 bg-green-100 gap-4 flex-1">
        <div className="col-span-2">
          <div className="flex items-start gap-3">
            <Header
              titulo="Boogarins"
              turne="The Town 2025"
              circulo="bg-green-500"
            />

            <DiaInfoCard info={"29-10-2025, São Paulo → São Paulo"} />
          </div>
        </div>

        <main className="flex flex-col min-h-0 w-full pr-2">
          <div className="space-y-3 overflow-y-auto max-h-full pr-3 md:pr-4 pb-2">
            {agenda.map((item, index) => (
              <AgendaCard key={index} {...item} />
            ))}
          </div>
        </main>

        <aside className="flex flex-col justify-between gap-5 pl-2 min-h-0">
          <MapCard />
          <div className="flex flex-row justify-between gap-4">
            <Porcentagem percent={10} />
            <ClimaCard />
          </div>
        </aside>
      </div>
    </Layout>
  );
};

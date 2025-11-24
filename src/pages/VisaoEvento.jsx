import React from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { MapCard } from "../components/VisaoEvento/MapCard";
import { Porcentagem } from "../components/VisaoEvento/Porcentagem";
import { AgendaCard } from "../components/VisaoEvento/AgendaCard";
import { ClimaCard } from "../components/VisaoEvento/ClimaCard";
import { Header } from "../components/Dashboard/Header";
import { DiaInfoCard } from "../components/VisaoEvento/DiaInfoCard";

export const VisaoEvento = ({ evento }) => {
  // SE o evento vier do backend, você substitui isso.
  const agenda = evento?.agenda ?? [
    {
      time: "12:00",
      title: "Transporte até o evento",
      description: "Van sai do hotel às 12:00. Chegada prevista 12:45.",
      active: true
    },
    {
      time: "12:45",
      title: "Descarregar a Van",
      description: "Equipe técnica inicia a descarga."
    },
    {
      time: "13:00",
      title: "Montagem do palco",
      description: "Montagem completa com equipe técnica."
    },
    {
      time: "13:30",
      title: "Passagem de som",
      description: "Soundcheck geral com a banda."
    },
    {
      time: "15:30",
      title: "Descanso",
      description: "Equipe liberada até as 18h."
    },
    {
      time: "18:00",
      title: "Showtime",
      description: "Entrada no palco."
    }
  ];

  return (
    <Layout>
      <Sidebar />

      <div className="grid grid-rows-[auto_1fr] grid-cols-2 max-h-screen w-full overflow-hidden p-4 bg-green-100 gap-4 flex-1">
        
        {/* Header */}
        <div className="col-span-2">
          <div className="flex items-start gap-3">
            <Header
              titulo={evento?.artista ?? "Boogarins"}
              turne={evento?.turne ?? "The Town 2025"}
              circulo="bg-green-500"
            />

            <DiaInfoCard info={evento?.dataInfo ?? "29-10-2025 — São Paulo → São Paulo"} />
          </div>
        </div>

        {/* AGENDA */}
        <main className="flex flex-col min-h-0 w-full pr-2">
          <div className="space-y-3 overflow-y-auto max-h-full pr-3">
            {agenda.map((item, index) => (
              <AgendaCard key={index} {...item} />
            ))}
          </div>
        </main>

        {/* MAP + INDICADORES */}
        <aside className="flex flex-col justify-between gap-5 pl-2 min-h-0">
          <MapCard 
            lat={evento?.coords?.lat ?? -23.5} 
            lon={evento?.coords?.lon ?? -46.6} 
          />

          <div className="flex flex-row justify-between gap-4">
            <Porcentagem percent={evento?.progresso ?? 60} />
            <ClimaCard cidade={evento?.cidade ?? "São Paulo"} />
          </div>
        </aside>
      </div>
    </Layout>
  );
};

export default VisaoEvento;

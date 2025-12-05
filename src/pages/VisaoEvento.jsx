import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { MapCard } from "../components/VisaoEvento/MapCard";
import { Porcentagem } from "../components/VisaoEvento/Porcentagem";
import { AgendaCard } from "../components/VisaoEvento/AgendaCard";
import { ClimaCard } from "../components/VisaoEvento/ClimaCard";
import { Header } from "../components/Dashboard/Header";
import { DiaInfoCard } from "../components/VisaoEvento/DiaInfoCard";

export default function VisaoEvento() {
  const { id } = useParams();

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // ===========================
  //   Buscar dados no backend
  // ===========================
  useEffect(() => {
    async function load() {
      try {
        const resp = await fetch(
          `http://localhost:8080/visao-evento/show/${id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );

        if (!resp.ok) {
          throw new Error("Erro ao buscar visão do evento");
        }

        const data = await resp.json();
        setEvento(data);

      } catch (err) {
        console.error(err);
        setErro(err.message);

      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // ===========================
  //   Estados de carregamento
  // ===========================
  if (loading) return <div className="p-6">Carregando evento...</div>;

  if (erro) return <div className="p-6 text-red-600">{erro}</div>;

  if (!evento) return <div className="p-6">Evento não encontrado.</div>;

  // ===========================
  //   AGENDA REAL OU MOCK
  // ===========================
  const agenda = evento.agenda ?? [];

  // ===========================
  //   Tela montada
  // ===========================
  return (
    <Layout>
      <Sidebar />

      <div className="grid grid-rows-[auto_1fr] grid-cols-2 max-h-screen w-full overflow-hidden p-4 bg-green-100 gap-4 flex-1">
        
        {/* Header */}
        <div className="col-span-2">
          <div className="flex items-start gap-3">
            <Header
              titulo={evento.artista}
              turne={evento.turne}
              circulo="bg-green-500"
            />
            <DiaInfoCard info={evento.dataInfo} />
          </div>
        </div>

        {/* Agenda */}
        <main className="flex flex-col min-h-0 w-full pr-2">
          <div className="space-y-3 overflow-y-auto max-h-full pr-3">
            {agenda.map((item, index) => (
              <AgendaCard key={index} {...item} />
            ))}
          </div>
        </main>

        {/* Mapa + Indicadores */}
        <aside className="flex flex-col justify-between gap-5 pl-2 min-h-0">
          <MapCard 
            lat={evento.coords.lat}
            lon={evento.coords.lon}
          />

          <div className="flex flex-row justify-between gap-4">
            <Porcentagem percent={evento.progresso} />
            <ClimaCard cidade={evento.cidade} />
          </div>
        </aside>
      </div>
    </Layout>
  );
}

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import MainCalendar from "../components/Dashboard/MainCalendar";
import SideCalendar from "../components/Dashboard/SideCalendar";
import { Header } from "../components/Dashboard/Header";
import { Container } from "../components/Dashboard/Container";
import { TaskList } from "../components/Dashboard/TaskList";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";

export const Calendario = () => {
  const [mainCalendarApi, setMainCalendarApi] = useState(null);

  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 flex flex-col p-5 bg-neutral-300 min-h-0">
        {/* Cabeçalho da main */}
        <Header
          titulo="Boogarins"
          turne="The Town 2025"
          circulo="bg-green-500"
        />

        {/* Container  */}
        <Container>
          <div className="min-w-[72%] h-full">
            <MainCalendar onCalendarApi={setMainCalendarApi} />
          </div>
          {/* Preview */}
          <div className="min-w-[27%] rounded-lg p-1 h-full bg-white">
            <SideCalendar mainCalendarApi={mainCalendarApi} />
            {/* Lista embaixo do calendário */}
            <TaskList />
          </div>
        </Container>
      </main>
    </Layout>
  );
};

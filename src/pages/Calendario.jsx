import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import MainCalendar from "../components/Dashboard/MainCalendar";
import SideCalendar from "../components/Dashboard/SideCalendar";
import { Header } from "../components/Dashboard/Header";
import { Container } from "../components/Dashboard/Container";
import { TaskList } from "../components/Dashboard/TaskList";
import { Layout } from "../components/Dashboard/Layout";
import {   } from "../components/Dashboard/Sidebar";
import { EventoModal } from "../components/EventoModal.jsx";

export const Calendario = () => {
  const [mainCalendarApi, setMainCalendarApi] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  
    const handleEventFinish = (eventData) => {
      console.log('Evento criado:', eventData);
      setIsModalOpen(false);
    };

  return (
    <div className="flex-1 flex flex-col p-5 bg-neutral-300 min-h-0 overflow-hidden">

      <Header
        titulo="Boogarins"
        turne="The Town 2025"
        circulo="bg-green-500"
      />

      <Container>
        <div className="min-w-[72%] h-full">
          <MainCalendar onCalendarApi={setMainCalendarApi} />
        </div>

        <div className="min-w-[27%] rounded-lg p-1 h-full bg-white">
          <SideCalendar mainCalendarApi={mainCalendarApi} />
          <TaskList />
        </div>

        <EventoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onFinish={handleEventFinish}
        />
      </Container>

    </div>
  );
};

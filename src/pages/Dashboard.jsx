import React, {useState} from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { Calendario } from "../components/Dashboard/Calendario";
import { EventoModal } from "../components/EventoModal.jsx";
export const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleEventFinish = (eventData) => {
    console.log('Evento criado:', eventData);
    setIsModalOpen(false);
  };
  return (
    <Layout>
      <Sidebar />
      <Calendario />
      <EventoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFinish={handleEventFinish}
      />
    </Layout>
  );
};

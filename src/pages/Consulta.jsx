import React, { useState } from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Header } from "../components/ConsultaLocal/Header";
import { ModalBox } from "../components/ConsultaLocal/ModalBox";
import { Content } from "../components/ConsultaLocal/Content";

export const Consulta = () => {
  const [activeTab, setActiveTab] = useState("aeroporto");
  const [showModal, setShowModal] = useState(true);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 flex flex-col p-5 bg-blue-100 min-h-0">
        <Header activeTab={activeTab} onTabChange={handleTabChange} />
        {showModal && (
          <ModalBox>
            <Content tipo={activeTab} onClose={handleCloseModal} />
          </ModalBox>
        )}
      </main>
    </Layout>
  );
};

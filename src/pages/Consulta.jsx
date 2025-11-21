import React from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Header } from "../components/ConsultaLocal/Header";
import { ModalBox } from "../components/ConsultaLocal/ModalBox";
import { Content } from "../components/ConsultaLocal/Content";

export const Consulta = () => {
  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 flex flex-col p-5 bg-blue-100 min-h-0">
        <Header />
        <ModalBox>
          <Content />
        </ModalBox>
      </main>
    </Layout>
  );
};

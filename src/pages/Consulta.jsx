import React from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Header } from "../components/ConsultaLocal/Header";

export const Consulta = () => {
  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 flex flex-col p-5 bg-neutral-300 min-h-0">
        <Header />
      </main>
    </Layout>
  );
};

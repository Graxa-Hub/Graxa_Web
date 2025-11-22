import React from "react";
import { Sidebar } from "../components/Sidebar/Sidebar";

export const Avancado = () => {
  return (
    <Layout>
      <Sidebar />
      <main className="flex-1 flex flex-col p-5 bg-neutral-300 min-h-0"></main>
      Avançado
    </Layout>
  );
};

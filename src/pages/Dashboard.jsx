import React from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { Calendario } from "../components/Dashboard/Calendario";

export const Dashboard = () => {
  return (
    <Layout>
      <Sidebar />
      <Calendario />
    </Layout>
  );
};

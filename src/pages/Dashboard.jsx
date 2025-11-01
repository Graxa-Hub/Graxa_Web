import React from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Header } from "../components/Dashboard/Header";
import { Calendario } from "../components/Dashboard/Calendario";

export const Dashboard = () => {
  return (
    <Layout>
      <Header />
      <Calendario />
    </Layout>
  );
};

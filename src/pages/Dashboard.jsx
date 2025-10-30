import React from "react";
import { Layout } from "../components/Dashboard/Layout";
import { Header } from "../components/Dashboard/Header";
import { Main } from "../components/Dashboard/Main";

export const Dashboard = () => {
  return (
    <Layout>
      <Header />
      <Main />
    </Layout>
  );
};

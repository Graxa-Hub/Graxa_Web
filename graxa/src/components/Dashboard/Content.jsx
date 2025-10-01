import React from "react";
import { Layout } from "./Layout";
import { SecondaryNav } from "./SecondaryNav";
import { Route, Routes } from "react-router-dom";

export const Content = () => {
  return (
    <Layout className="space-y-6">
      {/* Secondary Navbar */}
      <SecondaryNav />

      {/* Routing or Content */}
      <Routes>{/* <Route path="/" element={}/> */}</Routes>
    </Layout>
  );
};

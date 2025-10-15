import React from "react";
import { Layout } from "./Layout";
import { SecondaryNav } from "./SecondaryNav";
import { Route, Routes } from "react-router-dom";
import Calendar from "./Calendar";

export const Content = () => {
  return (
    <Layout className="space-y-6">
      {/* Secondary Navbar */}
      <SecondaryNav />

      {/* Routing or Content */}
      <Calendar />

      {/* <Routes><Route path="/" element={}/></Routes> */}
    </Layout>
  );
};

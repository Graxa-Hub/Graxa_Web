import React from "react";
import { Navbar } from "../components/Dashboard/Navbar";
import { RootLayout } from "../components/Dashboard/RootLayout";
import BgImg from "/cadastro-bg2.png";
import { Layout } from "../components/Dashboard/Layout";

export const Local = () => {
  return (
    <div>
      <RootLayout>
        {/* Background Image */}
        <img
          className="img w-full h-full object-cover object-center absolute top-0 left-0"
          src={BgImg}
          alt="Background Image"
        />

        {/* Bg Overlay */}
        <div className="w-full h-full absolute top-0 left-0 bg-gradient to-tr from-neutral-950/40 to-neutral-950/40"></div>

        {/* Layout Section */}
        <div className="w-full flex items-center gap-7 flex-wrap z-50">
          {/* Navbar */}
          <Navbar />

          <Layout>{/* Dashboard */}</Layout>
        </div>
      </RootLayout>
    </div>
  );
};

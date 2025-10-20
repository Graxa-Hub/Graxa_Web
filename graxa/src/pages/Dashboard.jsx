import React from "react";
import { RootLayout } from "../components/Dashboard/RootLayout";
import BgImg from "/cadastro-bg2.png";
import { Navbar } from "../components/Dashboard/Navbar";
import { SecondaryNav } from "../components/Dashboard/SecondaryNav";
import { Calendar } from "../components/Dashboard/Calendar";
import { Content } from "../components/Dashboard/Content";
import { Lista } from "../components/Dashboard/Lista";

export const Dashboard = () => {
  return (
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

        {/* Dashboard */}
        <Content>
          {/* Secondary Navbar */}
          <SecondaryNav />
          <div className="flex flex-row gap-1 col-2">
            <Calendar />
            <Lista />
          </div>
        </Content>
      </div>
    </RootLayout>
  );
};

import React from "react";
import { Link } from "react-router-dom";
import { ButtonNav } from "../components/ButtonNav";
import { HomeHero } from "../components/HomeHero";

export const Homepage = () => {
  return (
    <div>
      <ButtonNav />
      <HomeHero />
    </div>
  );
};

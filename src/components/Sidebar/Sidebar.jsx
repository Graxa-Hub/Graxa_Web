import React from "react";

import { useAuth } from "../../context/AuthContext";
import { Header } from "./Header";
import { UpperButton } from "./UpperButton";
import { FooterButton } from "./FooterButton";

export const Sidebar = () => {
  const { usuario, logout } = useAuth();

  return (
    <>
      <aside className="flex flex-col w-65 h-screen shadow-[2px_0_20px_0_rgba(0,0,0,0.25)] p-4">
        {/* Cabeçalho */}
        <Header usuario={usuario} />

        {/* Botões Navbar */}
        <nav className="flex flex-col flex-1 justify-between mt-4">
          {/* Os botões que ficam em cima */}
          <UpperButton />
          <FooterButton />
        </nav>
      </aside>
    </>
  );
};

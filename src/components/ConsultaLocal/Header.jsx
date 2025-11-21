import React from "react";
import { NavButton } from "./NavButton";
// import { Notificacao } from "../Notificacao/Notificacao";

export const Header = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-full py-2 grid grid-cols-3 items-center">
      <div></div>

      <NavButton activeTab={activeTab} onTabChange={onTabChange} />

      {/* <Notificacao /> */}
      <div className="justify-self-end">Notificação</div>
    </div>
  );
};

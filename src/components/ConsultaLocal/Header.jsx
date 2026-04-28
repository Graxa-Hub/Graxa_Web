import React from "react";
import { NavButton } from "./NavButton";
// import { Notificacao } from "../Notificacao/Notificacao";

export const Header = ({ activeTab, onTabChange }) => {
  return (
    <div className="w-full py-2 flex flex-col sm:grid sm:grid-cols-3 items-center gap-4 sm:gap-0">
      <div></div>

      <NavButton activeTab={activeTab} onTabChange={onTabChange} />

      {/* <Notificacao /> */}
      <div className="justify-self-end">Notificação</div>
    </div>
  );
};

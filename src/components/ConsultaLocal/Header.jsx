import React from "react";
// import { Notificacao } from "../Notificacao/Notificacao";

export const Header = () => {
  return (
    <div className="w-full py-2">
      <ul className="flex justify-self-center gap-5">
        <li>Aeroporto</li>
        <li>Restaurante</li>
        <li>Mapa</li>
      </ul>

      {/* <Notificacao /> */}
      <div className="justify-self-end">Notificação</div>
    </div>
  );
};

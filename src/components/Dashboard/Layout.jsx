import { User } from "lucide-react";
import React from "react";
import { Notificacao } from "../Notificacao/Notificacao";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen overflow-hidden flex">
      {children}
      
      {/* ✅ Componente de notificação fixo no canto superior direito */}
      <div className="fixed top-4 right-4 z-50">
        <Notificacao />
      </div>
    </div>
  );
};

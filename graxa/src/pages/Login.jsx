import React from "react";
import { Input } from "../components/Input";
import { VoltarButton } from "../components/VoltarButton";

export const Login = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className=" w-[80vw] h-[90vh] grid grid-cols-2">
        <div className="w-full h-full bg-red-500 p-6">
          {/* Botão de voltar */}
          <VoltarButton>Voltar</VoltarButton>
        </div>
        <div className="w-full h-full bg-blue-500"></div>
      </div>
    </div>
  );
};

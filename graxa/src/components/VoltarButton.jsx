import { MoveLeft } from "lucide-react";
import React from "react";

export const VoltarButton = ({ buttonText }) => {
  return (
    <div className="flex items-center w-full">
      <div className="flex justify-center items-center h-13 w-13 bg-gray-700 rounded-full">
        <MoveLeft className="text-white" size={16} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 ml-4">{buttonText}</h2>
    </div>
  );
};

import React from "react";

export const DiaInfoCard = ({ info = "29-10-2025, São Paulo → São Paulo" }) => {
  return (
    <div className="flex flex-col justify-center h-14 bg-white rounded-lg shadow-sm px-3 py-1">
      <p className="text-lg font-semibold">Dia de Show</p>
      <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
        {info}
      </p>
    </div>
  );
};

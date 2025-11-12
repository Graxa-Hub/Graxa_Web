import React from "react";
import { CircleDot } from "lucide-react";

export const MapCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <img
        src="https://maps.googleapis.com/maps/api/staticmap?center=-23.5505,-46.6333&zoom=12&size=600x300&markers=color:red%7C-23.5631,-46.6544&markers=color:red%7C-23.5565,-46.6621&key=AIzaSyExample"
        alt="Mapa do evento"
        className="w-full h-64 object-cover"
      />
      <div className="p-3 text-sm text-gray-700 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <CircleDot className="text-red-500 w-3 h-3" />
          <span className="font-medium">Transporte até o evento</span>
        </div>
        <p className="text-xs text-gray-500">
          Distância: <b>4,4 km</b> &nbsp; | &nbsp; Tempo Estimado:{" "}
          <b>43 minutos</b>
        </p>
      </div>
    </div>
  );
};

import React from "react";
import { CircleDot } from "lucide-react";

export const MapCard = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_STATIC_KEY;
  const center = "-23.5505,-46.6333"; // São Paulo
  const markers = [
    "color:red%7C-23.5631,-46.6544",
    "color:red%7C-23.5565,-46.6621",
  ].join("&markers=");
  const url = apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=12&size=640x360&scale=2&maptype=roadmap&markers=${markers}&key=${apiKey}`
    : null;
  return (
    <div className="flex flex-col justify-between h-full bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Mapa */}
      {url ? (
        <img
          src={url}
          alt="Mapa do evento"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 text-sm p-4 text-center">
          Defina VITE_GOOGLE_MAPS_STATIC_KEY no arquivo .env.local para carregar
          o mapa.
        </div>
      )}

      {/* Texto */}
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

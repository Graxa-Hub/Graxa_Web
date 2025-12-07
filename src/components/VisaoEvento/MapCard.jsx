import React, { useEffect, memo } from "react";
import { CircleDot, Navigation, Loader2 } from "lucide-react";
import { useMapboxRoute } from "../../hooks/useMapboxRoute";
import { useMapboxMap } from "../../hooks/useMapboxMap";

export const MapCard = memo(({ lat, lon, origem, destino, titulo }) => {
  const isRotaMode = Boolean(origem && destino);
  
  const { routeInfo, loading, error, calcularRota } = useMapboxRoute();
  const { mapContainerRef, adicionarRota, adicionarMarcador } = useMapboxMap({
    center: [lon || -46.6333, lat || -23.5505],
    zoom: 12
  });

  // Calcular rota quando origem/destino existirem
  useEffect(() => {
    if (isRotaMode) {
      calcularRota(origem, destino);
    }
  }, [origem, destino, isRotaMode, calcularRota]);

  // Renderizar rota ou marcador simples
  useEffect(() => {
    if (routeInfo) {
      adicionarRota(routeInfo);
    } else if (!isRotaMode && lat && lon) {
      adicionarMarcador({ lat, lon });
    }
  }, [routeInfo, isRotaMode, lat, lon, adicionarRota, adicionarMarcador]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Mapa */}
      <div 
        ref={mapContainerRef} 
        className="flex-1 w-full relative"
        style={{ minHeight: '300px' }}
      >
        {loading && (
          <LoadingOverlay />
        )}
        {error && (
          <ErrorOverlay message={error} />
        )}
      </div>

      {/* Info Footer */}
      {routeInfo ? (
        <RouteInfo routeInfo={routeInfo} titulo={titulo} />
      ) : (
        <LocalInfo />
      )}
    </div>
  );
});

MapCard.displayName = 'MapCard';

// ===== COMPONENTES AUXILIARES =====

const LoadingOverlay = memo(() => (
  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      <p className="text-sm text-gray-600">Calculando rota...</p>
    </div>
  </div>
));

LoadingOverlay.displayName = 'LoadingOverlay';

const ErrorOverlay = memo(({ message }) => (
  <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10 p-4">
    <p className="text-sm text-red-600 text-center">{message}</p>
  </div>
));

ErrorOverlay.displayName = 'ErrorOverlay';

const RouteInfo = memo(({ routeInfo, titulo }) => (
  <div className="p-3 text-sm text-gray-700 flex flex-col gap-1 border-t flex-shrink-0">
    <div className="flex items-center gap-2">
      <Navigation className="text-blue-500 w-4 h-4" />
      <span className="font-medium truncate">{titulo || "Rota de Deslocamento"}</span>
    </div>
    <p className="text-xs text-gray-500">
      <b>{routeInfo.distanceKm} km</b> &nbsp;•&nbsp; 
      <b>{routeInfo.durationMin} min</b>
    </p>
  </div>
));

RouteInfo.displayName = 'RouteInfo';

const LocalInfo = memo(() => (
  <div className="p-3 text-sm text-gray-700 flex flex-col gap-1 border-t flex-shrink-0">
    <div className="flex items-center gap-2">
      <CircleDot className="text-red-500 w-4 h-4" />
      <span className="font-medium">Local do Evento</span>
    </div>
  </div>
));

LocalInfo.displayName = 'LocalInfo';
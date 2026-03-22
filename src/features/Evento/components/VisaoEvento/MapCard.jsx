import React, { useEffect, memo } from "react";
import { CircleDot, Navigation, Loader2 } from "lucide-react";
import { useMapboxRoute } from "../../../../hooks/useMapboxRoute";
import { useMapboxMap } from "../../../../hooks/useMapboxMap";

export const MapCard = memo(({ lat, lon, origem, destino, titulo }) => {
  const isRotaMode = Boolean(origem && destino);
  const { routeInfo, loading, error, calcularRota } = useMapboxRoute();
  const { mapContainerRef, adicionarRota, adicionarMarcador } = useMapboxMap({
    center: [lon || -46.6333, lat || -23.5505],
    zoom: 12,
  });

  useEffect(() => {
    if (isRotaMode) calcularRota(origem, destino);
  }, [origem, destino, isRotaMode, calcularRota]);

  useEffect(() => {
    if (routeInfo) adicionarRota(routeInfo);
    else if (!isRotaMode && lat && lon) adicionarMarcador({ lat, lon });
  }, [routeInfo, isRotaMode, lat, lon, adicionarRota, adicionarMarcador]);

  return (
    <div className="surface-card flex flex-col overflow-hidden h-full min-h-0">
      <div ref={mapContainerRef} className="flex-1 w-full relative min-h-[250px] bg-[var(--surface)]">
        {loading && <LoadingOverlay />}
        {error && <ErrorOverlay message={error} />}
      </div>
      {routeInfo ? <RouteInfo routeInfo={routeInfo} titulo={titulo} /> : <LocalInfo />}
    </div>
  );
});

MapCard.displayName = "MapCard";

const LoadingOverlay = memo(() => (
  <div className="absolute inset-0 bg-[color:var(--overlay)]/20 flex items-center justify-center z-10">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
      <p className="text-sm text-[var(--text-secondary)]">Calculando rota...</p>
    </div>
  </div>
));

LoadingOverlay.displayName = "LoadingOverlay";

const ErrorOverlay = memo(({ message }) => (
  <div className="absolute inset-0 bg-[var(--surface)] flex items-center justify-center z-10 p-4">
    <p className="text-sm text-[var(--accent)] text-center">{message}</p>
  </div>
));

ErrorOverlay.displayName = "ErrorOverlay";

const RouteInfo = memo(({ routeInfo, titulo }) => (
  <div className="p-3 text-sm text-[var(--text-secondary)] flex flex-col gap-1 border-t border-[var(--border)] flex-shrink-0 bg-[var(--surface)]">
    <div className="flex items-center gap-2">
      <Navigation className="text-[var(--accent)] w-4 h-4" />
      <span className="font-medium truncate text-[var(--text-primary)]">{titulo || "Rota de Deslocamento"}</span>
    </div>
    <p className="text-xs text-[var(--text-muted)]">
      <b>{routeInfo.distanceKm} km</b> &nbsp;•&nbsp;<b>{routeInfo.durationMin} min</b>
    </p>
  </div>
));

RouteInfo.displayName = "RouteInfo";

const LocalInfo = memo(() => (
  <div className="p-3 text-sm text-[var(--text-secondary)] flex flex-col gap-1 border-t border-[var(--border)] flex-shrink-0 bg-[var(--surface)]">
    <div className="flex items-center gap-2">
      <CircleDot className="text-[var(--accent)] w-4 h-4" />
      <span className="font-medium text-[var(--text-primary)]">Local do Evento</span>
    </div>
  </div>
));

LocalInfo.displayName = "LocalInfo";

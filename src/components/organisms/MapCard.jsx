import { memo, useEffect } from "react";
import { CircleDot, Loader2, Navigation } from "lucide-react";
import { useMapboxMap } from "../../hooks/useMapboxMap";
import { useMapboxRoute } from "../../hooks/useMapboxRoute";

export const MapCard = memo(({ lat, lon, origem, destino, titulo }) => {
  const isRotaMode = Boolean(origem && destino);

  const { routeInfo, loading, error, calcularRota } = useMapboxRoute();
  const { mapContainerRef, adicionarRota, adicionarMarcador } = useMapboxMap({
    center: [lon || -46.6333, lat || -23.5505],
    zoom: 12,
  });

  useEffect(() => {
    if (isRotaMode) {
      calcularRota(origem, destino);
    }
  }, [origem, destino, isRotaMode, calcularRota]);

  useEffect(() => {
    if (routeInfo) {
      adicionarRota(routeInfo);
    } else if (!isRotaMode && lat && lon) {
      adicionarMarcador({ lat, lon });
    }
  }, [routeInfo, isRotaMode, lat, lon, adicionarRota, adicionarMarcador]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)]">
      <div
        ref={mapContainerRef}
        className="relative w-full flex-1"
        style={{ minHeight: "320px" }}
      >
        {loading && <LoadingOverlay />}
        {error && <ErrorOverlay message={error} />}
      </div>

      {routeInfo ? (
        <RouteInfo routeInfo={routeInfo} titulo={titulo} />
      ) : (
        <LocalInfo />
      )}
    </div>
  );
});

MapCard.displayName = "MapCard";

const LoadingOverlay = memo(() => (
  <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--surface-elevated)]/80">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--info)]" />
      <p className="text-sm text-[var(--text-secondary)]">Calculando rota...</p>
    </div>
  </div>
));

LoadingOverlay.displayName = "LoadingOverlay";

const ErrorOverlay = memo(({ message }) => (
  <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--surface)] p-4">
    <p className="text-center text-sm text-[var(--accent)]">{message}</p>
  </div>
));

ErrorOverlay.displayName = "ErrorOverlay";

const RouteInfo = memo(({ routeInfo, titulo }) => (
  <div className="flex flex-shrink-0 flex-col gap-1 p-3 text-sm text-[var(--text-secondary)]">
    <div className="flex items-center gap-2">
      <Navigation className="h-4 w-4 text-[var(--info)]" />
      <span className="truncate font-medium">
        {titulo || "Rota de Deslocamento"}
      </span>
    </div>
    <p className="text-xs text-[var(--text-muted)]">
      <b>{routeInfo.distanceKm} km</b> &nbsp;•&nbsp;
      <b>{routeInfo.durationMin} min</b>
    </p>
  </div>
));

RouteInfo.displayName = "RouteInfo";

const LocalInfo = memo(() => (
  <div className="flex flex-shrink-0 flex-col gap-1 p-3 text-sm text-[var(--text-secondary)]">
    <div className="flex items-center gap-2">
      <CircleDot className="h-4 w-4 text-[var(--accent)]" />
      <span className="font-medium">Local do Evento</span>
    </div>
  </div>
));

LocalInfo.displayName = "LocalInfo";

// Simple Mapbox-based directions service
// Requires Vite env var: VITE_MAPBOX_TOKEN

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export async function getDistance(origemText, destinoText) {
  if (!TOKEN) throw new Error("Mapbox token ausente (VITE_MAPBOX_TOKEN)");

  const origem = await geocode(origemText);
  const destino = await geocode(destinoText);

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${origem.lon},${origem.lat};${destino.lon},${destino.lat}?geometries=geojson&access_token=${TOKEN}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao consultar rotas");
  const data = await res.json();
  if (!data.routes || data.routes.length === 0) throw new Error("Nenhuma rota encontrada");

  const route = data.routes[0];
  return {
    km: Number(route.distance / 1000),
    duracaoMin: Math.round(route.duration / 60),
    geometry: route.geometry,
  };
}

async function geocode(q) {
  if (!TOKEN) throw new Error("Mapbox token ausente (VITE_MAPBOX_TOKEN)");
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?access_token=${TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao geocodificar endereço");
  const data = await res.json();
  const [lon, lat] = data.features?.[0]?.center ?? [];
  if (lat == null || lon == null) throw new Error("Endereço inválido");
  return { lat, lon };
}

export { geocode };

export default { getDistance, geocode };

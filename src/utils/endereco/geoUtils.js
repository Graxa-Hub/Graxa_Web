// src/utils/endereco/geoUtils.js

// 🔑 SEU TOKEN MAPBOX
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiZ2FicmllbHNvdXNhLXNwdGVjaCIsImEiOiJjbWZ5N2ZzaGwwaHp2MmpwemFtczJib3YzIn0.opNfyOXGWBuKl1R4iJiSOQ";

/**
 * Geocodificação: converte texto (CEP, endereço) em coordenadas reais do Mapbox
 */
export async function getCoordinates(endereco) {
  const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

  if (!endereco || endereco.trim().length < 3) {
    throw new Error("Endereço inválido.");
  }

  const query = encodeURIComponent(endereco + ", Brasil");

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${accessToken}&limit=1`;

  const response = await fetch(url);
  const data = await response.json();

  // PREVENÇÃO DE ERRO
  if (!data || !data.features || data.features.length === 0) {
    throw new Error("Endereço não encontrado. Tente incluir cidade/estado.");
  }

  const f = data.features[0];

  return {
    lat: f.center[1],
    lon: f.center[0],
    display_name: f.place_name
  };
}

/**
 * Reverse Geocoding: converte coordenadas → endereço amigável
 */
export async function getEnderecoPorCoordenadas(lat, lon) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${MAPBOX_TOKEN}&limit=1`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }

    return "Endereço não disponível";
  } catch (err) {
    console.error("Erro reverse geocode:", err);
    return "Endereço não disponível";
  }
}

/**
 * Fórmula de Haversine – calcula distância em km entre 2 coordenadas.
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // raio da Terra em KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

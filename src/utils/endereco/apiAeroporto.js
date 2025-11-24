// src/utils/endereco/apiAeroporto.js
import { getCoordinates, calculateDistance, getEnderecoPorCoordenadas } from "./geoUtils";

// Lista básica de aeroportos brasileiros com coordenadas aproximadas
// Você pode ampliar essa lista depois conforme precisar.
const AEROPORTOS_BR = [
  { nome: "Aeroporto Internacional de São Paulo/Guarulhos", sigla: "GRU", lat: -23.4356, lon: -46.4731 },
  { nome: "Aeroporto de São Paulo/Congonhas", sigla: "CGH", lat: -23.6266, lon: -46.6554 },
  { nome: "Aeroporto Internacional do Rio de Janeiro/Galeão", sigla: "GIG", lat: -22.8099, lon: -43.2505 },
  { nome: "Aeroporto Santos Dumont", sigla: "SDU", lat: -22.9105, lon: -43.1634 },
  { nome: "Aeroporto Internacional de Brasília", sigla: "BSB", lat: -15.8711, lon: -47.9172 },
  { nome: "Aeroporto Internacional de Belo Horizonte/Confins", sigla: "CNF", lat: -19.6244, lon: -43.9719 },
  { nome: "Aeroporto Internacional de Salvador", sigla: "SSA", lat: -12.9086, lon: -38.3225 },
  { nome: "Aeroporto Internacional de Recife", sigla: "REC", lat: -8.1265, lon: -34.9236 },
  { nome: "Aeroporto Internacional de Fortaleza", sigla: "FOR", lat: -3.7763, lon: -38.5326 },
  { nome: "Aeroporto Internacional de Porto Alegre", sigla: "POA", lat: -29.9939, lon: -51.1711 }
];

/**
 * Resolve qualquer coisa (CEP, endereço ou objeto com dados do CEP)
 * em coordenadas e uma label amigável.
 */
async function resolverOrigem(origem) {
  // Caso já venha com lat/lon (ex: você já salvou no localShow ou hotel)
  if (origem && typeof origem === "object" && origem.lat && origem.lon) {
    return {
      lat: origem.lat,
      lon: origem.lon,
      label:
        origem.enderecoCompleto ||
        origem.enderecoParaBusca ||
        origem.endereco ||
        "Origem"
    };
  }

  // Caso seja string (CEP ou endereço)
  const coords = await getCoordinates(origem);
  return {
    lat: coords.lat,
    lon: coords.lon,
    label: coords.display_name || String(origem)
  };
}

/**
 * Busca o aeroporto brasileiro mais próximo de uma origem
 * (CEP, endereço, ou objeto com lat/lon).
 *
 * Retorna JSON estruturado:
 * {
 *   origem: { lat, lon, label },
 *   aeroporto: { nome, sigla, endereco, lat, lon, distanciaKm }
 * }
 */
export async function buscarAeroportoMaisProximo(origem) {
  if (!origem) {
    throw new Error("Origem não informada para buscar aeroporto.");
  }

  // 1. Resolver origem em coordenadas
  const origemRes = await resolverOrigem(origem);

  // 2. Encontrar aeroporto mais próximo
  let melhor = null;
  let menorDist = Infinity;

  for (const aeroporto of AEROPORTOS_BR) {
    const dist = calculateDistance(
      origemRes.lat,
      origemRes.lon,
      aeroporto.lat,
      aeroporto.lon
    );

    if (dist < menorDist) {
      menorDist = dist;
      melhor = { ...aeroporto, distanciaKm: dist };
    }
  }

  if (!melhor) {
    throw new Error("Nenhum aeroporto encontrado.");
  }

  // 3. Buscar endereço aproximado do aeroporto (opcional, via Mapbox)
  const enderecoAeroporto = await getEnderecoPorCoordenadas(
    melhor.lat,
    melhor.lon
  );

  return {
    origem: {
      lat: origemRes.lat,
      lon: origemRes.lon,
      label: origemRes.label
    },
    aeroporto: {
      nome: melhor.nome,
      sigla: melhor.sigla,
      lat: melhor.lat,
      lon: melhor.lon,
      endereco: enderecoAeroporto,
      distanciaKm: Number(melhor.distanciaKm.toFixed(1))
    }
  };
}

/**
 * Helper opcional: calcula distância entre esse aeroporto e outro ponto
 * (ex: hotel ou local do show).
 *
 * aeroportoInfo: retorno de buscarAeroportoMaisProximo().aeroporto
 * destino: { lat, lon }
 */
export function calcularDistanciaAeroportoParaDestino(aeroportoInfo, destino) {
  if (!aeroportoInfo || !destino || !destino.lat || !destino.lon) {
    return null;
  }

  const dist = calculateDistance(
    aeroportoInfo.lat,
    aeroportoInfo.lon,
    destino.lat,
    destino.lon
  );

  return Number(dist.toFixed(1));
}

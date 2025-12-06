// src/services/logisticaService.js
import { api } from "../services/axios"; // ajuste caminho se precisar

export const logisticaService = {
  // HOTEL
  criarHotelEvento: async (dto) => {
    // dto = { showId, colaboradorId, nomeHotel, endereco, latitude, longitude, distanciaPalcoKm, distanciaAeroportoKm, checkin, checkout }
    const res = await api.post("/hotel-evento", dto);
    return res.data;
  },

  // VOO
  criarVooEvento: async (dto) => {
    // dto = { showId, colaboradorId, ciaAerea, codigoVoo, origem, destino, partida, chegada }
    const res = await api.post("/voo-evento", dto);
    return res.data;
  },

  // TRANSPORTE
  criarTransporteEvento: async (dto) => {
    // dto = { showId, colaboradorId, tipo, saida, destino, motorista, observacao }
    const res = await api.post("/transporte-evento", dto);
    return res.data;
  },

  // AGENDA
  criarAgendaEvento: async (dto) => {
    // dto = { showId, colaboradorId (opt), titulo, descricao, dataHora, duracaoMinutos, ordem }
    const res = await api.post("/agenda-evento", dto);
    return res.data;
  }
};

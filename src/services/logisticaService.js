import { api } from "./axios";

export const logisticaService = {

  // HOTEL
  listarHoteis: async (showId) => {
    const res = await api.get(`/hotel-evento/show/${showId}`);
    return res.data;
  },

  criarHotelEvento: async (dto) => {
    const res = await api.post("/hotel-evento", dto);
    return res.data;
  },

  atualizarHotelEvento: async (id, dto) => {
    const res = await api.put(`/hotel-evento/${id}`, dto);
    return res.data;
  },

  removerHotelEvento: async (id) => {
    await api.delete(`/hotel-evento/${id}`);
  },


  // VOOS

  listarVoos: async (showId) => {
    const res = await api.get(`/voo-evento/show/${showId}`);
    return res.data;
  },

  criarVooEvento: async (dto) => {
    const res = await api.post("/voo-evento", dto);
    return res.data;
  },

  atualizarVooEvento: async (id, dto) => {
    const res = await api.put(`/voo-evento/${id}`, dto);
    return res.data;
  },

  removerVooEvento: async (id) => {
    await api.delete(`/voo-evento/${id}`);
  },


  // TRANSPORTE

  listarTransportes: async (showId) => {
    const res = await api.get(`/transporte-evento/show/${showId}`);
    return res.data;
  },

  criarTransporteEvento: async (dto) => {
    const res = await api.post("/transporte-evento", dto);
    return res.data;
  },

  atualizarTransporteEvento: async (id, dto) => {
    const res = await api.put(`/transporte-evento/${id}`, dto);
    return res.data;
  },

  removerTransporteEvento: async (id) => {
    await api.delete(`/transporte-evento/${id}`);
  }
};

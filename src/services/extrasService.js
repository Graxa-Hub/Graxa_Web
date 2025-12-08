import { api } from "./axios";

export const extrasService = {
  
  listarExtras: async (showId) => {
    const res = await api.get(`/extra-evento/show/${showId}`);
    return res.data;
  },

  salvarExtraEvento: async (dto) => {
    const res = await api.post("/extra-evento", dto);
    return res.data;
  },

  removerExtraEvento: async (id) => {
    await api.delete(`/extra-evento/${id}`);
  }
};

import { api } from "../services/axios";

export async function imagemService(nomeImagem) {

  try {
    const response = await api.get(`/imagens/download/${nomeImagem}`, {
      responseType: "blob",
    });

    return URL.createObjectURL(response.data);
  } catch (err) {
    console.error("Erro ao buscar imagem:", err);
    return "/default-turne-image.jpg";
  }
}

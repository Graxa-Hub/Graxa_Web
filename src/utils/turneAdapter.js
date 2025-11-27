import { imagemService } from "../services/imagemService";

export async function adaptTurnesFromBackend(turnes) {
  if (!Array.isArray(turnes)) {
    console.error("adaptTurnesFromBackend: turnes não é array:", turnes);
    return [];
  }

  return await Promise.all(
    turnes.map(async (turne) => {
      return await adaptTurneFromBackend(turne);
    })
  );
}

export async function adaptTurneFromBackend(turne) {
  let imageUrl = "/default-turne-image.jpg";

  if (turne.nomeImagem) {
    try {
      imageUrl = await imagemService(turne.nomeImagem);
    } catch (error) {
      console.error("Erro ao buscar imagem da turnê:", error);
    }
  }

  // Formatação das datas
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
  };

  const adapted = {
    id: turne.id,
    name: turne.nomeTurne,
    description: turne.descricao || "",
    image: imageUrl,
    startDate: formatDate(turne.dataHoraInicioTurne),
    endDate: formatDate(turne.dataHoraFimTurne),
    // IMPORTANTE: Preservar informações da banda
    bandaId: turne.bandaId || turne.banda?.id || null,
    banda: turne.banda || null,
    raw: turne, // Manter dados originais para debug
  };
  return adapted;
}

export function dateToISO(date) {
  if (!date) return null;
  return date.toISOString();
}

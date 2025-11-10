import { fetchImage } from '../services/imagemService';

/**
 * Adapta dados da turnê do backend para o formato do frontend
 */
export const adaptTurneFromBackend = async (turneBackend) => {
  // Busca a imagem se tiver nomeArquivo
  let imageUrl = '/default-turne-image.jpg';
  console.log("linha 9" + turneBackend.nomeImagem);
  if (turneBackend.nomeImagem) {
    console.log('Buscando imagem para turnê:'+ turneBackend.nomeImagem);
    try {
      imageUrl = await fetchImage(turneBackend.nomeImagem);
      console.log('Imagem adaptada com sucesso:', imageUrl);
    } catch (error) {
      console.error('Erro ao buscar imagem:', error);
      // Mantém imagem padrão
    }
  }

  return {
    id: turneBackend.id,
    name: turneBackend.nomeTurne,
    startDate: formatDateFromISO(turneBackend.dataHoraInicioTurne),
    endDate: formatDateFromISO(turneBackend.dataHoraFimTurne),
    description: turneBackend.descricao || '',
    image: imageUrl
  };
};

/**
 * Adapta array de turnês do backend (ASYNC agora!)
 */
export const adaptTurnesFromBackend = async (turnesBackend) => {
  const promises = turnesBackend.map(turne => adaptTurneFromBackend(turne));
  return Promise.all(promises);
};

/**
 * Formata data ISO para formato brasileiro
 */
const formatDateFromISO = (isoDate) => {
  if (!isoDate) return '';
  
  const date = new Date(isoDate);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Converte Date para ISO string
 */
export const dateToISO = (date) => {
  if (!date) return null;
  return date.toISOString();
};

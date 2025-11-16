export function mapErrorsToFields(errors, fieldMap) {
  const fieldErrors = {};
  
  errors.forEach(error => {
    for (const [fieldName, keywords] of Object.entries(fieldMap)) {
      if (keywords.some(keyword => error.toLowerCase().includes(keyword.toLowerCase()))) {
        fieldErrors[fieldName] = error;
        break;
      }
    }
  });
  
  return fieldErrors;
}

export const SHOW_ERROR_MAP = {
  titulo: ['Título'],
  bandas: ['banda'],
  local: ['Local', 'local'],
  logradouro: ['Logradouro'],
  numero: ['Número'],
  cidade: ['Cidade'],
  estado: ['Estado'],
  cep: ['CEP'],
  dataHoraInicio: ['início'],
  dataHoraFim: ['fim'],
  nomeLocal: ['Nome do local'],
  capacidade: ['Capacidade'],
  nomeTurne: ['Nome da turnê'],
  bandaTurne: ['Banda é obrigatória']
};

export const VIAGEM_ERROR_MAP = {
  nomeEvento: ['Título', 'nome'],
  tipoViagem: ['transporte', 'tipo'],
  dataInicio: ['partida', 'início'],
  dataFim: ['chegada', 'fim'],
  turneId: ['turnê', 'turne']
};
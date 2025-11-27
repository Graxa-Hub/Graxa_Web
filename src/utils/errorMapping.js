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
  titulo: ["titulo", "título"],
  bandaId: ["banda", "bandaId"],
  local: ["local", "localId"],
  nomeLocal: ["nomeLocal"],
  capacidade: ["capacidade"],
  logradouro: ["logradouro"],
  numero: ["numero", "número"],
  cidade: ["cidade"],
  estado: ["estado"],
  cep: ["cep"],
  dataHoraInicio: ["dataHoraInicio", "início"],
  dataHoraFim: ["dataHoraFim", "fim"]
};

export const VIAGEM_ERROR_MAP = {
  nomeEvento: ['Título', 'nome'],
  tipoViagem: ['transporte', 'tipo'],
  dataInicio: ['partida', 'início'],
  dataFim: ['chegada', 'fim'],
  turneId: ['turnê', 'turne']
};
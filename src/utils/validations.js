// ========== VALIDAÇÕES BÁSICAS REUTILIZÁVEIS ==========

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} é obrigatório`;
  }
  return null;
};

export const isPositiveNumber = (value, fieldName) => {
  if (value && parseFloat(value) < 0) {
    return `${fieldName} não pode ser negativo`;
  }
  return null;
};

export const isValidDateRange = (inicio, fim, startLabel = 'início', endLabel = 'fim') => {
  if (!inicio || !fim) return null;
  
  const dataInicio = new Date(inicio);
  const dataFim = new Date(fim);
  
  if (dataFim <= dataInicio) {
    return `Data/hora de ${endLabel} deve ser posterior à data/hora de ${startLabel}`;
  }
  return null;
};

export const isValidCep = (cep) => {
  if (!cep) return null;
  const cepLimpo = cep.replace(/\D/g, '');
  return cepLimpo.length === 8 ? null : 'CEP inválido (deve conter 8 dígitos)';
};

export const hasMinLength = (array, min, fieldName) => {
  if (!array || array.length < min) {
    return `Selecione pelo menos ${min} ${fieldName}`;
  }
  return null;
};

export const isValidEmail = (email, fieldName = 'E-mail') => {
  if (!email) return null;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? null : `${fieldName} inválido`;
};

// ========== VALIDAÇÕES DE ENDEREÇO ==========

export const validateEndereco = (endereco, isRequiredField = false) => {
  const errors = [];

  if (isRequiredField || endereco.logradouro || endereco.numero || endereco.cidade) {
    const logradouroError = validateRequired(endereco.logradouro, 'Logradouro');
    if (logradouroError) errors.push(logradouroError);

    const numeroError = validateRequired(endereco.numero, 'Número');
    if (numeroError) errors.push(numeroError);

    const cidadeError = validateRequired(endereco.cidade, 'Cidade');
    if (cidadeError) errors.push(cidadeError);

    const estadoError = validateRequired(endereco.estado, 'Estado');
    if (estadoError) errors.push(estadoError);

    const cepError = isValidCep(endereco.cep);
    if (cepError) errors.push(cepError);
  }

  return errors;
};

// ========== VALIDAÇÕES DE EVENTOS ==========

const validateEventoBase = (data) => {
  const errors = [];

  const tituloError = validateRequired(data.titulo, 'Título');
  if (tituloError) errors.push(tituloError);

  const inicioError = validateRequired(data.dataHoraInicio, 'Data/hora de início');
  if (inicioError) errors.push(inicioError);

  const fimError = validateRequired(data.dataHoraFim, 'Data/hora de fim');
  if (fimError) errors.push(fimError);

  const dateRangeError = isValidDateRange(data.dataHoraInicio, data.dataHoraFim);
  if (dateRangeError) errors.push(dateRangeError);

  return errors;
};

// Validação genérica de campos obrigatórios
function validateRequiredField(value, fieldName) {
  if (!value?.trim()) {
    return `${fieldName} é obrigatório`;
  }
  return null;
}

// Validação de datas
function validateDateRange(dataInicio, dataFim, labelInicio = 'Data de início', labelFim = 'Data de fim') {
  const errors = [];
  
  if (!dataInicio) {
    errors.push(`${labelInicio} é obrigatória`);
  }
  
  if (!dataFim) {
    errors.push(`${labelFim} é obrigatória`);
  }
  
  if (dataInicio && dataFim) {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    if (fim <= inicio) {
      errors.push(`${labelFim} deve ser posterior à ${labelInicio.toLowerCase()}`);
    }
  }
  
  return errors;
}

export function validateShow(data, novoLocal, showNovoLocal) {
  const errors = [];

  const tituloError = validateRequiredField(data.titulo, 'Título do show');
  if (tituloError) errors.push(tituloError);

  if (!data.bandasIds || data.bandasIds.length === 0) {
    errors.push('Selecione pelo menos uma banda');
  }

  if (!showNovoLocal) {
    if (!data.localId) {
      errors.push('Local do show é obrigatório');
    }
  } else {
    const nomeLocalError = validateRequiredField(novoLocal.nome, 'Nome do local');
    if (nomeLocalError) errors.push(nomeLocalError);

    const capacidadeError = validateRequiredField(novoLocal.capacidade, 'Capacidade');
    if (capacidadeError) errors.push(capacidadeError);

    const cepError = validateRequiredField(novoLocal.endereco?.cep, 'CEP');
    if (cepError) errors.push(cepError);

    const logradouroError = validateRequiredField(novoLocal.endereco?.logradouro, 'Logradouro');
    if (logradouroError) errors.push(logradouroError);

    const numeroError = validateRequiredField(novoLocal.endereco?.numero, 'Número');
    if (numeroError) errors.push(numeroError);

    const cidadeError = validateRequiredField(novoLocal.endereco?.cidade, 'Cidade');
    if (cidadeError) errors.push(cidadeError);

    const estadoError = validateRequiredField(novoLocal.endereco?.estado, 'Estado');
    if (estadoError) errors.push(estadoError);
  }

  const dateErrors = validateDateRange(
    data.dataHoraInicio, 
    data.dataHoraFim, 
    'Data/hora de início', 
    'Data/hora de fim'
  );
  errors.push(...dateErrors);

  return errors;
}

export function validateViagem(data) {
  const errors = [];

  const nomeEventoError = validateRequiredField(data.nomeEvento, 'Título da viagem');
  if (nomeEventoError) errors.push(nomeEventoError);

  // Removido validação de origem e destino pois não estão no DTO

  if (!data.tipoViagem) {
    errors.push('Tipo de transporte é obrigatório');
  }

  const dateErrors = validateDateRange(
    data.dataInicio, 
    data.dataFim, 
    'Data/hora de partida', 
    'Data/hora de chegada'
  );
  errors.push(...dateErrors);

  return errors;
}

export function validateTurne(data, bandas = []) {
  const errors = [];

  const nomeError = validateRequiredField(data.nome, 'Nome da turnê');
  if (nomeError) errors.push(nomeError);

  if (!data.bandaId) {
    errors.push('Banda é obrigatória');
  }

  return errors;
}

// ========== VALIDAÇÕES DE FORMULÁRIOS COMPLETOS ==========

export const validateForm = (fields) => {
  const errors = [];

  fields.forEach(({ value, type, label, min, max, pattern }) => {
    switch (type) {
      case 'required':
        const requiredError = validateRequired(value, label);
        if (requiredError) errors.push(requiredError);
        break;

      case 'email':
        const emailError = isValidEmail(value, label);
        if (emailError) errors.push(emailError);
        break;

      case 'positive':
        const positiveError = isPositiveNumber(value, label);
        if (positiveError) errors.push(positiveError);
        break;

      case 'minLength':
        const minLengthError = hasMinLength(value, min, label);
        if (minLengthError) errors.push(minLengthError);
        break;

      case 'cep':
        const cepError = isValidCep(value);
        if (cepError) errors.push(cepError);
        break;

      default:
        break;
    }
  });

  return errors;
};
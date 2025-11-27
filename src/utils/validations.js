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

  if (!data.titulo || !data.titulo.trim()) errors.push("titulo");
  if (!data.bandaId) errors.push("bandaId");

  if (!showNovoLocal) {
    if (!data.localId) errors.push("local");
  } else {
    if (!novoLocal.nome || !novoLocal.nome.trim()) errors.push("nomeLocal");
    if (!novoLocal.capacidade) errors.push("capacidade");
    if (!novoLocal.endereco?.cep || !novoLocal.endereco.cep.trim()) errors.push("cep");
    if (!novoLocal.endereco?.logradouro || !novoLocal.endereco.logradouro.trim()) errors.push("logradouro");
    if (!novoLocal.endereco?.numero || !novoLocal.endereco.numero.trim()) errors.push("numero");
    if (!novoLocal.endereco?.cidade || !novoLocal.endereco.cidade.trim()) errors.push("cidade");
    if (!novoLocal.endereco?.estado || !novoLocal.endereco.estado.trim()) errors.push("estado");
  }

  if (!data.dataHoraInicio) errors.push("dataHoraInicio");
  if (!data.dataHoraFim) errors.push("dataHoraFim");
  if (
    data.dataHoraInicio &&
    data.dataHoraFim &&
    new Date(data.dataHoraFim) <= new Date(data.dataHoraInicio)
  ) {
    errors.push("dataHoraFim");
  }

  return errors;
}

export function validateViagem(data) {
  const errors = [];

  if (!data.nomeEvento || !data.nomeEvento.trim()) errors.push("nomeEvento");
  if (!data.tipoViagem) errors.push("tipoViagem");
  if (!data.dataInicio) errors.push("dataInicio");
  if (!data.dataFim) errors.push("dataFim");
  if (
    data.dataInicio &&
    data.dataFim &&
    new Date(data.dataFim) <= new Date(data.dataInicio)
  ) {
    errors.push("dataFim");
  }
  if (!data.turneId) errors.push("turneId");

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
// src/constants/logistica.js

/**
 * Tipos de recursos de logística
 */
export const LOGISTICA_TYPES = {
  HOTEL: 'hotel',
  FLIGHT: 'flight',
  TRANSPORTE: 'transporte',
};

/**
 * Template inicial para novos itens de logística
 */
export const LOGISTICA_TEMPLATES = {
  [LOGISTICA_TYPES.HOTEL]: {
    id: null,
    nome: "",
    endereco: "",
    checkin: "",
    checkout: "",
    distanciaAeroportoKm: null,
    distanciaPalcoKm: null,
    hospedes: [],
  },
  [LOGISTICA_TYPES.FLIGHT]: {
    id: null,
    cia: "",
    numero: "",
    origem: "",
    destino: "",
    saida: "",
    chegada: "",
    passageiros: [],
  },
  [LOGISTICA_TYPES.TRANSPORTE]: {
    id: null,
    tipo: "",
    saida: "",
    chegada: "",
    responsavel: "",
    passageiros: [],
    observacao: "",
  },
};

/**
 * Labels para UI
 */
export const LOGISTICA_LABELS = {
  [LOGISTICA_TYPES.HOTEL]: {
    singular: "Hotel",
    plural: "Hotéis",
    addButton: "Adicionar Hotel",
    section: "Hospedagem",
  },
  [LOGISTICA_TYPES.FLIGHT]: {
    singular: "Voo",
    plural: "Voos",
    addButton: "Adicionar Voo",
    section: "Voos da Equipe",
  },
  [LOGISTICA_TYPES.TRANSPORTE]: {
    singular: "Transporte",
    plural: "Transportes",
    addButton: "Adicionar Transporte",
    section: "Transportes",
  },
};

/**
 * Mapeamento de campos backend → frontend
 */
export const FIELD_MAPPING = {
  hotel: {
    nomeHotel: "nome",
    // endereco permanece igual
    // checkin permanece igual
    // checkout permanece igual
  },
  flight: {
    ciaAerea: "cia",
    codigoVoo: "numero",
    partida: "saida",
    // origem permanece igual
    // destino permanece igual
    // chegada permanece igual
  },
  transporte: {
    motorista: "responsavel",
    // tipo permanece igual
    // saida permanece igual
    // chegada permanece igual
    // observacao permanece igual
  },
};

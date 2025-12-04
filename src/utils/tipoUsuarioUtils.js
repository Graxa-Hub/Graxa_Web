import { TIPOS_USUARIO } from '../constants/tipoUsuario';

/**
 * Traduz o tipo de usuário para um nome legível
 * @param {string} tipoUsuario - Código do tipo de usuário
 * @returns {string} Nome legível do tipo de usuário
 */
export function obterFuncao(tipoUsuario) {
  if (!tipoUsuario) {
    return 'Colaborador';
  }

  // Busca no array de tipos de usuário
  const tipoEncontrado = TIPOS_USUARIO.find(tipo => tipo.value === tipoUsuario);
  
  if (tipoEncontrado) {
    return tipoEncontrado.label;
  }

  // Fallbacks para casos especiais que podem não estar no constants
  const fallbacks = {
    'cantorPopular': 'Cantor Popular',
    'instrumentista': 'Instrumentista',
    'seguranca': 'Segurança',
    'manager': 'Manager',
    'fotografo': 'Fotógrafo',
    'videomaker': 'Videomaker',
    'roadie': 'Roadie',
    'producaoGeral': 'Produção Geral',
    'assistenteProducao': 'Assistente de Produção',
    'coordenadorTecnico': 'Coordenador Técnico',
  };

  if (fallbacks[tipoUsuario]) {
    return fallbacks[tipoUsuario];
  }

  // Se não encontrar, retorna o valor original formatado
  return tipoUsuario
    .replace(/([A-Z])/g, ' $1') // Adiciona espaço antes de maiúsculas
    .replace(/^./, str => str.toUpperCase()) // Primeira letra maiúscula
    .trim();
}

/**
 * Verifica se um tipo de usuário é técnico
 * @param {string} tipoUsuario - Código do tipo de usuário
 * @returns {boolean} True se for técnico
 */
export function isTecnico(tipoUsuario) {
  const tiposTecnicos = [
    'tecnicoSom',
    'tecnicoLuz', 
    'tecnicoMonitor',
    'tecnicoPA',
    'engenheiroSom',
  ];
  return tiposTecnicos.includes(tipoUsuario);
}

/**
 * Verifica se um tipo de usuário é músico/artista
 * @param {string} tipoUsuario - Código do tipo de usuário
 * @returns {boolean} True se for músico/artista
 */
export function isMusico(tipoUsuario) {
  const tiposMusicos = [
    'guitarrista', 'baixista', 'baterista', 'tecladista', 'violonista',
    'vocalista', 'saxofonista', 'trompetista', 'trombonista', 'percussionista',
    'violinista', 'celista', 'contrabaixista', 'flautista', 'clarinetista',
    'oboista', 'fagotista', 'harpista', 'pianista', 'acordeonista',
    'gaiteiro', 'bandolinista', 'cavaquinista', 'ukulelista',
    'guitarraRitmica', 'guitarraSolo', 'dj', 'mc', 'regente', 'maestro',
    'backingVocal', 'corista', 'rapper', 'violista', 'tubista',
    'saxBaritono', 'saxTenor', 'saxAlto', 'saxSoprano', 'trompa',
    'euphonium', 'timpanista', 'marimbista', 'xilofonista', 'vibrafonista',
    'triangulista', 'cantorLirico', 'soprano', 'contralto', 'tenor',
    'baritono', 'baixo', 'artista', 'cantorPopular', 'instrumentista'
  ];
  return tiposMusicos.includes(tipoUsuario);
}

/**
 * Verifica se um tipo de usuário é de produção
 * @param {string} tipoUsuario - Código do tipo de usuário
 * @returns {boolean} True se for de produção
 */
export function isProducao(tipoUsuario) {
  const tiposProducao = [
    'produtorEstrada', 'preProdutor', 'produtor', 'produtorMusical',
    'manager', 'producaoGeral', 'assistenteProducao', 'coordenadorTecnico'
  ];
  return tiposProducao.includes(tipoUsuario);
}

/**
 * Obtém a categoria do tipo de usuário
 * @param {string} tipoUsuario - Código do tipo de usuário
 * @returns {string} Categoria do usuário
 */
export function obterCategoria(tipoUsuario) {
  if (isMusico(tipoUsuario)) return 'Artístico';
  if (isTecnico(tipoUsuario)) return 'Técnico';
  if (isProducao(tipoUsuario)) return 'Produção';
  return 'Geral';
}

/**
 * ✅ NOVO: Obtém função sem emoji (para usar em textos simples)
 * @param {string} tipoUsuario - Código do tipo de usuário
 * @returns {string} Nome da função sem emoji
 */
export function obterFuncaoSemEmoji(tipoUsuario) {
  return obterFuncao(tipoUsuario); // Já não tem emoji
}

/**
 * Obtém o ícone/emoji adequado para o tipo de usuário
 * @param {string} tipoUsuario - Código do tipo de usuário
 * @returns {string} Emoji/ícone do tipo
 */
export function obterIcone(tipoUsuario) {
  const icones = {
    // Artísticos
    'cantorLirico': '🎭', 'cantorPopular': '🎤', 'vocalista': '🎤',
    'guitarrista': '🎸', 'baixista': '🎸', 'baterista': '🥁',
    'tecladista': '🎹', 'pianista': '🎹', 'violonista': '🎻',
    'saxofonista': '🎷', 'trompetista': '🎺', 'flautista': '🪈',
    'dj': '🎧', 'mc': '🎤', 'rapper': '🎤',
    
    // Técnicos
    'tecnicoSom': '🔊', 'tecnicoLuz': '💡', 'engenheiroSom': '🎛️',
    
    // Produção
    'produtor': '📋', 'manager': '👔', 'produtorMusical': '🎵',
    
    // Geral
    'road': '🔧', 'roadie': '🔧', 'fotografo': '📸', 'videomaker': '🎬'
  };
  
  return icones[tipoUsuario] || '👤';
}

/**
 * ✅ NOVO: Obtém função com emoji (quando quiser mostrar com ícone)
 * @param {string} tipoUsuario - Código do tipo de usuário
 * @returns {string} Nome da função com emoji
 */
export function obterFuncaoComEmoji(tipoUsuario) {
  const funcao = obterFuncao(tipoUsuario);
  const emoji = obterIcone(tipoUsuario);
  return `${emoji} ${funcao}`;
}
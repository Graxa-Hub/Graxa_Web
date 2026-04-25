import { api } from './axios';
import { adaptTurnesFromBackend } from '../utils/turneAdapter';

export async function getTurnes() {
  try {
    const response = await api.get('/turnes');
    // Handle both array and paginated object responses
    const turnesData = Array.isArray(response.data) ? response.data : response.data?.content || [];
    
    // Adaptar dados usando o turneAdapter
    const turnesAdaptados = await adaptTurnesFromBackend(turnesData);
    
    return turnesAdaptados;
  } catch (error) {
    console.error('Erro ao buscar turnês:', error);
    throw error;
  }
}

export async function getTurnesPaginadas(page = 0, size = 10) {
  try {
    const response = await api.get('/turnes', {
      params: { page, size },
    });

    // Adaptar os dados usando o turneAdapter
    const turnesAdaptados = await adaptTurnesFromBackend(response.data.content || []);

    // Retornar resposta paginada com estrutura normalizada e dados adaptados
    return {
      content: turnesAdaptados,
      pageable: response.data.pageable || { pageNumber: page, pageSize: size },
      totalPages: response.data.totalPages || 1,
      totalElements: response.data.totalElements || 0,
      first: response.data.first ?? true,
      last: response.data.last ?? false,
      empty: response.data.empty ?? true,
    };
  } catch (error) {
    console.error('Erro ao buscar turnês paginadas:', error);
    throw error;
  }
}

export async function getTurnesPaginadasPorBanda(bandaId, page = 0, size = 10) {
  try {
    const response = await api.get(`/turnes/banda/${bandaId}`, {
      params: { page, size },
    });

    // Adaptar os dados usando o turneAdapter
    const turnesAdaptados = await adaptTurnesFromBackend(response.data.content || []);

    // Retornar resposta paginada com estrutura normalizada
    return {
      content: turnesAdaptados,
      pageNumber: response.data.pageable?.pageNumber || page,
      totalPages: response.data.totalPages || 1,
      totalElements: response.data.totalElements || 0,
      first: response.data.first ?? true,
      last: response.data.last ?? false,
      empty: response.data.empty ?? false,
    };
  } catch (error) {
    console.error(`[turneService] Erro ao buscar turnês paginadas da banda ${bandaId}:`, error);
    throw error;
  }
}

export async function buscarTurnes(query) {
  try {
    const response = await api.get('/turnes/buscar', {
      params: { nome: query },
    });
    
    // Adaptar dados usando o turneAdapter
    const turnesData = Array.isArray(response.data) ? response.data : response.data?.content || [];
    const turnesAdaptados = await adaptTurnesFromBackend(turnesData);
    
    return turnesAdaptados;
  } catch (error) {
    console.error('Erro ao buscar turnês:', error);
    // Se erro, retorna array vazio ao invés de quebrar
    return [];
  }
}

export async function buscarTurnesPorBanda(bandaId, query) {
  try {
    const response = await api.get(`/turnes/banda/${bandaId}`, {
      params: { nome: query },
    });
    
    // Adaptar dados usando o turneAdapter
    const turnesData = Array.isArray(response.data) ? response.data : response.data?.content || [];
    const turnesAdaptados = await adaptTurnesFromBackend(turnesData);
    
    return turnesAdaptados;
  } catch (error) {
    console.error(`[turneService] Erro ao buscar turnês da banda ${bandaId}:`, error);
    // Se erro, retorna array vazio ao invés de quebrar
    return [];
  }
}

export async function criarTurne(dadosTurne, imagem) {
  try {
    const formData = new FormData();
    
    // O backend espera @RequestPart("dados") com JSON
    const dados = {
      nomeTurne: dadosTurne.nomeTurne,
      dataHoraInicioTurne: dadosTurne.dataHoraInicioTurne,
      dataHoraFimTurne: dadosTurne.dataHoraFimTurne,
      descricao: dadosTurne.descricao,
      bandaId: dadosTurne.bandaId
    };
    
    // Criar blob JSON com Content-Type application/json
    const dadosBlob = new Blob([JSON.stringify(dados)], {
      type: 'application/json'
    });
    
    formData.append('dados', dadosBlob);
    
    // Enviar imagem no part "imagem"
    if (imagem) {
      formData.append('imagem', imagem);
    }

    

    const response = await api.post('/turnes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    
    return response.data;
  } catch (error) {
    console.error('Erro ao criar turnê:', error);
    throw error;
  }
}

export async function editarTurne(id, dadosTurne, imagem) {
  try {
    const formData = new FormData();
    
    // O backend espera @RequestPart("dados") com JSON
    const dados = {
      nomeTurne: dadosTurne.nomeTurne,
      dataHoraInicioTurne: dadosTurne.dataHoraInicioTurne,
      dataHoraFimTurne: dadosTurne.dataHoraFimTurne,
      descricao: dadosTurne.descricao,
      bandaId: dadosTurne.bandaId
    };
    
    // Criar blob JSON com Content-Type application/json
    const dadosBlob = new Blob([JSON.stringify(dados)], {
      type: 'application/json'
    });
    
    formData.append('dados', dadosBlob);
    
    // Enviar imagem no part "imagem" se fornecida
    if (imagem) {
      formData.append('imagem', imagem);
    }

    

    const response = await api.put(`/turnes/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Erro ao editar turnê:', error);
    throw error;
  }
}

export async function deletarTurne(id) {
  try {
    const response = await api.delete(`/turnes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar turnê:', error);
    throw error;
  }
}
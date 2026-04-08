import { api } from './axios';

export async function getTurnes() {
  try {
    const response = await api.get('/turnes');
    // Handle both array and paginated object responses
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data?.content) {
      return response.data.content;
    } else {
      return [];
    }
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

    // Retornar resposta paginada com estrutura normalizada
    return {
      content: Array.isArray(response.data.content) ? response.data.content : [],
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
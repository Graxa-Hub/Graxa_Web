import { api } from './axios';

export const getTurnes = async () => {
  const response = await api.get('/turnes');
  console.log("Response getTurnes:", response);
  return response.data;
};

export const criarTurne = async (turneData, imagemFile) => {
  const formData = new FormData();
  
  // Cria o objeto de dados da turnê
  const dados = {
    nomeTurne: turneData.nome,
    dataHoraInicioTurne: turneData.dataInicio,
    dataHoraFimTurne: turneData.dataFim,
    descricao: turneData.descricao
  };
  
  // Adiciona os dados como JSON blob
  formData.append('dados', new Blob([JSON.stringify(dados)], {
    type: 'application/json'
  }));
  
  // Adiciona a imagem (obrigatória)
  formData.append('imagem', imagemFile);
  
  const response = await api.post('/turnes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

export const editarTurne = async (id, turneData, imagemFile = null) => {
  const formData = new FormData();
  
  const dados = {
    nomeTurne: turneData.nome,
    dataHoraInicioTurne: turneData.dataInicio,
    dataHoraFimTurne: turneData.dataFim,
    descricao: turneData.descricao
  };
  
  formData.append('dados', new Blob([JSON.stringify(dados)], {
    type: 'application/json'
  }));
  
  // Adiciona imagem apenas se foi enviada uma nova
  if (imagemFile) {
    formData.append('imagem', imagemFile);
  }
  
  const response = await api.put(`/turnes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

export const deletarTurne = async (id) => {
  const response = await api.delete(`/turnes/${id}`);
  return response.data;
};
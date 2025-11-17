import axios from 'axios';

const API_URL = import.meta.env.VITE_API_SPRING;

export const login = async (credentials) =>{
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
}

export const cadastro = async (userData) =>{
    console.log(userData)
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    console.log("Resposta do backend:", response.data);
    return response;
}

export const getColaborador = async (userId) => {
    try {
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`${API_URL}/colaboradores/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Erro ao buscar colaborador:', error);
        throw error;
    }
};

export async function enviarCodigoRecuperacao(email) {
    console.log("URL chamada:", `${API_URL}/credenciais/recuperar-senha`);
  try {
    const response = await axios.post(`${API_URL}/credenciais/recuperar-senha`, { email });
    return response.data;
  } catch (error) {
    throw error.response || error;
  }
}
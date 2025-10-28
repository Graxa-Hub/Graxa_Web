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
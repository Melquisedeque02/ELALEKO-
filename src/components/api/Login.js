import axios from 'axios';
import { API_URL } from './ApiConfig';

export const Login = async (costumerData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, costumerData);
    return response.data;  
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || 'Erro desconhecido.',
      };
    } else {
      // Erros sem resposta do servidor (ex: rede caída)
      return {
        success: false,
        message: 'Erro de conexão com o servidor.',
      };
    }
  }
};

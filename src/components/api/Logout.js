import axios from 'axios';
import { API_URL } from './ApiConfig';

export const Logout = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    return response.data; // Backend retorna um objeto com 'success' e 'message'
  } catch (error) {
    console.error('Erro ao realizar logout:', error.response?.data || error.message);
    return { success: false, message: error.message };
  }
};

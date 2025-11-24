import api from '../token';

export const ListUserId = async () => {
  try {
    const response = await api.post('/getUserId');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};


import api from '../token';

export const ListUser = async () => {
  try {
    const response = await api.post('/getUser');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};


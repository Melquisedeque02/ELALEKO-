import api from '../token';

export const ListMesa = async () => {
  try {
    const response = await api.post('/getMesa');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};


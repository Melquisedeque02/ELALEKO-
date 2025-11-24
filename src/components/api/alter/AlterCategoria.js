import api from '../token';

export const AlterCategoria = async (produto) => {
  try {
    const response = await api.post('/alterCategoria', produto);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return { success: false, message: error.message };
  }
};
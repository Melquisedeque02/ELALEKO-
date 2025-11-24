import api from '../token';

export const AlterPedido = async (produto) => {
  try {
    const response = await api.post('/alterPedido', produto);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return { success: false, message: error.message };
  }
};
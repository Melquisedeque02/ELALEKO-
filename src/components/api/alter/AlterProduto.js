
import api from '../token';

export const AlterProduto = async (produto) => {
  try {
    const response = await api.post('/alterProduto', produto);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return { success: false, message: error.message };
  }
};
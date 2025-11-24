import api from '../token';

export const AddMesa = async (produto) => {
  try {
    const response = await api.post('/addMesa', produto);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    return { success: false, message: error.message };
  }
};



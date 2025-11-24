import api from '../token';

export const ListPedido = async () => {
  try {
    const response = await api.post('/getPedido');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};


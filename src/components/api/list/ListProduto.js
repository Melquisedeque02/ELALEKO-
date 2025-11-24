 

import api from '../token';

export const ListProduto = async () => {
  try {
    const response = await api.post('/getProduto');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};


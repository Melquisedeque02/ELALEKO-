 

import api from '../token';

export const ListCategoria = async () => {
  try {
    const response = await api.post('/getCategoria');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
};


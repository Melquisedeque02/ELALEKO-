import api from '../token';

export const ListConvidado = async (payload) => {
  try {
    const response = await api.post('/getConvidado', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return {
        success: false,
        message: error.response.data.message || 'Erro no servidor.',
        data: error.response.data,
      };
    }

    return {
      success: false,
      message: 'Erro de conexão com o servidor.',
    };
  }
};


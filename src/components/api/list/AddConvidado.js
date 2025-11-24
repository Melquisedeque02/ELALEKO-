import api from '../token';

export const AddConvidado = async (dados) => {
  try {
    const response = await api.post('/addConvidado', dados);
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

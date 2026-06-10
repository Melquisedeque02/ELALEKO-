// ==================== CONFIGURAÇÃO AUTOMÁTICA DA API ====================
// Detecta se está acessando pelo computador (localhost) ou pelo iPhone (IP)

const getApiUrl = () => {
  const hostname = window.location.hostname;
  
  // Se estiver em desenvolvimento no computador
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  
  // Se estiver acessando pelo IP da rede (iPhone, tablet, etc.)
  // Usa o mesmo IP da página atual, mas na porta 5000
  return `http://${hostname}:5000/api`;
};

const API_BASE_URL = getApiUrl();

console.log('🔗 API URL:', API_BASE_URL); // Para debug

class ApiService {
  // ==================== AUTENTICAÇÃO ====================
  
  static getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  static async login(email, senha) {
  try {
    console.log('🔐 Tentando login em:', `${API_BASE_URL}/auth/login`);
    
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      // Mostrar mensagem de erro correta
      const errorMsg = data.error || data.message || 'Erro ao fazer login';
      throw new Error(errorMsg);
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error);
    throw error;
  }
}

  static async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  static isAutenticado() {
    return !!localStorage.getItem('token');
  }

  static getUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  // ==================== ADMIN (GESTÃO DE UTILIZADORES) ====================

  static async listarUsuariosAdmin() {
    const response = await fetch(`${API_BASE_URL}/admin/usuarios`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erro ao listar utilizadores');
    return await response.json();
  }

  static async alterarStatusUsuario(id, ativo) {
    const response = await fetch(`${API_BASE_URL}/admin/usuarios/status`, {
      method: 'PATCH',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ativo })
    });
    if (!response.ok) throw new Error('Erro ao alterar status');
    return await response.json();
  }

  static async deletarUsuarioAdmin(id) {
    const response = await fetch(`${API_BASE_URL}/admin/usuarios/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erro ao deletar utilizador');
    return await response.json();
  }

  // ==================== EVENTOS ====================

  static async criarEvento(eventoData) {
    const response = await fetch(`${API_BASE_URL}/eventos`, {
      method: 'POST',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(eventoData)
    });
    if (!response.ok) throw new Error('Erro ao criar evento');
    return await response.json();
  }

  static async listarEventos() {
    const response = await fetch(`${API_BASE_URL}/eventos`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erro ao listar eventos');
    return await response.json();
  }

  static async atualizarEvento(id, eventoData) {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
      method: 'PUT',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(eventoData)
    });
    if (!response.ok) throw new Error('Erro ao atualizar evento');
    return await response.json();
  }

  static async deletarEvento(id) {
    const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) throw new Error('Erro ao deletar evento');
    return await response.json();
  }

  static async buscarEventoPorId(id) {
  const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
    headers: this.getAuthHeaders()
  });
  if (!response.ok) throw new Error('Erro ao buscar evento');
  return await response.json();
}

  // ==================== REGISTO DO ORGANIZADOR ====================
  
  static async registrarOrganizador(nome, email, senha) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/registrar/organizador`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    } catch (error) {
      console.error('❌ Erro ao registrar organizador:', error);
      throw error;
    }
  }

  // ==================== CONVITES (PÚBLICOS) ====================
  
  static async criarConvite(conviteData) {
  try {
    const response = await fetch(`${API_BASE_URL}/convites`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()  // ← ADICIONAR TOKEN
      },
      body: JSON.stringify({
        nome_convidado1: conviteData.guestName1,
        nome_convidado2: conviteData.guestName2 || null,
        endereco: conviteData.endereco || null,
        nome_evento: conviteData.nome_evento || null,
        data_evento: conviteData.data_evento || null,
        hora_evento: conviteData.hora_evento || null,
        cronograma: conviteData.cronograma || null,
        manual: conviteData.manual || null,
        declaracao: conviteData.declaracao || null,
        presentes: conviteData.presentes || null,
        evento_id: conviteData.evento_id || null,
        pai_noivo: conviteData.pai_noivo || null,
        mae_noivo: conviteData.mae_noivo || null,
        pai_noiva: conviteData.pai_noiva || null,
        mae_noiva: conviteData.mae_noiva || null,
        template: conviteData.template || 'classico'
      })
    });
    if (!response.ok) throw new Error('Erro ao criar convite');
    return await response.json();
  } catch (error) {
    console.error('❌ Erro ao criar convite:', error);
    throw error;
  }
}

static async listarConvites() {
  try {
    const response = await fetch(`${API_BASE_URL}/convites`, {
      headers: this.getAuthHeaders()  // ← TEM DE TER ISTO!
    });
    if (!response.ok) throw new Error('Erro ao buscar convites');
    return await response.json();
  } catch (error) {
    console.error('❌ Erro ao listar convites:', error);
    throw error;
  }
}

  static async buscarConvitePorId(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/convites/${id}`, {
      headers: this.getAuthHeaders()  // ← ADICIONAR TOKEN
    });
    if (!response.ok) throw new Error('Erro ao buscar detalhes');
    return await response.json();
  } catch (error) {
    console.error('❌ Erro ao buscar convite:', error);
    throw error;
  }
}

  static async atualizarConvite(id, conviteData) {
  try {
    const response = await fetch(`${API_BASE_URL}/convites/${id}`, {
      method: 'PUT',
      headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome_convidado1: conviteData.nome_convidado1,
        nome_convidado2: conviteData.nome_convidado2 || null,
        nome_evento: conviteData.nome_evento || null,
        data_evento: conviteData.data_evento || null,
        hora_evento: conviteData.hora_evento || null,
        endereco: conviteData.endereco || null
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao atualizar convite');
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Erro ao atualizar convite:', error);
    throw error;
  }
}

static async deletarConvite(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/convites/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao deletar convite');
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Erro ao deletar:', error);
    throw error;
  }
}

  // ==================== CONVITES POR EVENTO ====================
  
  static async listarConvitesPorEvento(eventoId) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites/evento/${eventoId}`, {
        headers: this.getAuthHeaders()
      });
      if (!response.ok) throw new Error('Erro ao listar convites do evento');
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao listar convites por evento:', error);
      throw error;
    }
  }

  // ==================== VALIDAÇÃO PARA ADMIN (ScannerPage) ====================
  
  static async validarConvite(qrCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites/publico/${qrCode}`);
      
      if (response.status === 404) {
        return { valido: false, mensagem: 'Convite não encontrado' };
      }
      
      if (!response.ok) throw new Error('Erro ao validar convite');
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao validar convite:', error);
      throw error;
    }
  }

  static async utilizarConvite(qrCode) {
  try {
    const response = await fetch(`${API_BASE_URL}/convites/${qrCode}/utilizar`, { 
      method: 'PATCH',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao marcar convite');
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Erro ao utilizar convite:', error);
    throw error;
  }
}

  // ==================== PÁGINA PÚBLICA DO CONVIDADO ====================
  
  static async buscarLocalizacaoPublica(qrCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites/publico/${qrCode}`);
      if (!response.ok) throw new Error('Erro ao buscar localização');
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao buscar localização:', error);
      throw error;
    }
  }

  // ==================== VALIDAÇÃO PARA SEGURANÇA (PROTEGIDA) ====================
  
  static async validarConviteSeguranca(qrCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites/validar/${qrCode}`, {
        headers: this.getAuthHeaders()
      });
      
      if (response.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      if (response.status === 404) {
        return { valido: false, mensagem: 'Convite não encontrado' };
      }
      
      if (!response.ok) throw new Error('Erro ao validar convite');
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao validar convite (segurança):', error);
      throw error;
    }
  }

  static async utilizarConviteSeguranca(qrCode) {
    try {
      const response = await fetch(`${API_BASE_URL}/convites/${qrCode}/utilizar`, { 
        method: 'PATCH',
        headers: this.getAuthHeaders()
      });
      
      if (response.status === 401) {
        throw new Error('Sessão expirada. Faça login novamente.');
      }
      
      if (!response.ok) throw new Error('Erro ao marcar convite');
      return await response.json();
    } catch (error) {
      console.error('❌ Erro ao utilizar convite (segurança):', error);
      throw error;
    }
  }

  static async criarUsuarioAdmin(dados) {
  const response = await fetch(`${API_BASE_URL}/admin/usuarios`, {
    method: 'POST',
    headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  if (!response.ok) throw new Error('Erro ao criar utilizador');
  return await response.json();
}
static async listarUsuariosAdmin() {
  const response = await fetch(`${API_BASE_URL}/admin/usuarios`, {
    headers: this.getAuthHeaders()  // ← Isto envia o token
  });
  if (!response.ok) throw new Error('Erro ao listar utilizadores');
  return await response.json();
}

static async comprarCreditosSimulado(quantidade) {
  const response = await fetch(`${API_BASE_URL}/pagamento/comprar-simulado`, {
    method: 'POST',
    headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantidade })
  });
  if (!response.ok) throw new Error('Erro na compra simulada');
  return await response.json();
}

static async gerarTemplateIASimulado(descricao) {
  const response = await fetch(`${API_BASE_URL}/ia/gerar-template-simulado`, {
    method: 'POST',
    headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ descricao })
  });
  if (!response.ok) throw new Error('Erro ao gerar template');
  return await response.json();
}
// ==================== CRÉDITOS ====================
static async getSaldoCreditos() {
  const response = await fetch(`${API_BASE_URL}/creditos/saldo`, {
    headers: this.getAuthHeaders()
  });
  if (!response.ok) throw new Error('Erro ao buscar saldo');
  return await response.json();
}

static async comprarCreditos(quantidade) {
  const response = await fetch(`${API_BASE_URL}/creditos/comprar`, {
    method: 'POST',
    headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantidade })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  return await response.json();
}

// ==================== IA ====================
static async gerarTemplateIA(descricao) {
  const response = await fetch(`${API_BASE_URL}/ia/gerar-template`, {
    method: 'POST',
    headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ descricao })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  return await response.json();
}


// ==================== ADMIN CRÉDITOS ====================
static async listarOrganizadoresCreditos() {
  const response = await fetch(`${API_BASE_URL}/admin/organizadores/creditos`, { headers: this.getAuthHeaders() });
  if (!response.ok) throw new Error('Erro ao listar organizadores');
  return await response.json();
}

static async editarCreditosAdmin(userId, creditos) {
  const response = await fetch(`${API_BASE_URL}/admin/organizadores/creditos`, {
    method: 'PUT',
    headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, creditos })
  });
  if (!response.ok) throw new Error('Erro ao editar créditos');
  return await response.json();
}

static async listarTransacoesAdmin(filtros = {}) {
  const params = new URLSearchParams(filtros).toString();
  const response = await fetch(`${API_BASE_URL}/admin/transacoes?${params}`, { headers: this.getAuthHeaders() });
  if (!response.ok) throw new Error('Erro ao listar transações');
  return await response.json();
}

static async listarTemplatesIAAdmin() {
  const response = await fetch(`${API_BASE_URL}/admin/templates-ia`, { headers: this.getAuthHeaders() });
  if (!response.ok) throw new Error('Erro ao listar templates IA');
  return await response.json();
}

static async getConfiguracoes() {
  const response = await fetch(`${API_BASE_URL}/admin/configuracoes`, {
    headers: this.getAuthHeaders()
  });
  if (!response.ok) throw new Error('Erro ao buscar configurações');
  const data = await response.json();
  // Garantir que precos_pacotes é um array
  if (data.precos_pacotes && typeof data.precos_pacotes === 'string') {
    data.precos_pacotes = JSON.parse(data.precos_pacotes);
  }
  return data;
}

static async atualizarConfiguracoes(config) {
  const response = await fetch(`${API_BASE_URL}/admin/configuracoes`, {
    method: 'PUT',
    headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  if (!response.ok) throw new Error('Erro ao atualizar configurações');
  return await response.json();
}

static async listarLogsIA() {
  const response = await fetch(`${API_BASE_URL}/admin/logs-ia`, { headers: this.getAuthHeaders() });
  if (!response.ok) throw new Error('Erro ao listar logs IA');
  return await response.json();
}

static async getLimitesOrganizador() {
  const response = await fetch(`${API_BASE_URL}/organizador/limites`, {
    headers: this.getAuthHeaders()
  });
  if (!response.ok) throw new Error('Erro ao buscar limites');
  return await response.json();
}

static async atualizarLimitesAdmin(userId, limites) {
  const response = await fetch(`${API_BASE_URL}/admin/organizadores/limites`, {
    method: 'PUT',
    headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...limites })
  });
  if (!response.ok) throw new Error('Erro ao atualizar limites');
  return await response.json();
}

static async downloadAllConvites(eventoId) {
  const response = await fetch(`${API_BASE_URL}/convites/evento/${eventoId}/download-all`, {
    headers: this.getAuthHeaders()
  });
  
  if (!response.ok) {
    let errorMessage = 'Erro ao baixar convites';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch(e) {}
    throw new Error(errorMessage);
  }
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `convites_evento_${eventoId}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  return true;
}

static async buscarEventoPorId(id) {
  const response = await fetch(`${API_BASE_URL}/eventos/${id}`, {
    headers: this.getAuthHeaders()
  });
  if (!response.ok) throw new Error('Erro ao buscar evento');
  return await response.json();
}

static getAuthHeaders() {
  const token = localStorage.getItem('token');
  console.log('🔑 Token em getAuthHeaders:', token ? `${token.substring(0, 20)}...` : 'null');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

static async importarConvites(eventoId, formData) {
  const response = await fetch(`${API_BASE_URL}/convites/evento/${eventoId}/importar`, {
    method: 'POST',
    headers: this.getAuthHeaders(),
    body: formData
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  return await response.json();
}

static async forgotPassword(email) {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
}

static async resetPassword(token, novaSenha) {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, novaSenha })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error);
  return data;
}

static async listarTiposEvento() {
  const response = await fetch(`${API_BASE_URL}/tipos-evento`, { headers: this.getAuthHeaders() });
  if (!response.ok) throw new Error('Erro ao listar tipos');
  return await response.json();
}
static async criarTipoEvento(nome) {
  const response = await fetch(`${API_BASE_URL}/tipos-evento`, {
    method: 'POST',
    headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome })
  });
  if (!response.ok) throw new Error('Erro ao criar tipo');
  return await response.json();
}
}



export default ApiService;
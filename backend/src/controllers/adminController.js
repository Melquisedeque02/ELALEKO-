const db = require('../config/database');

// Listar todos os utilizadores
exports.listarUsuarios = (req, res) => {
  const query = `SELECT id, nome, email, role, ativo, created_at FROM usuarios ORDER BY created_at DESC`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao listar usuários:', err);
      return res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
    res.json(rows);
  });
};

// Alterar estado (ativo/inativo)
exports.alterarStatusUsuario = (req, res) => {
  const { id, ativo } = req.body;
  const query = `UPDATE usuarios SET ativo = ? WHERE id = ?`;
  db.run(query, [ativo, id], function(err) {
    if (err) {
      console.error('Erro ao alterar status:', err);
      return res.status(500).json({ error: 'Erro ao alterar status' });
    }
    res.json({ message: `Usuário ${ativo === 1 ? 'ativado' : 'desativado'} com sucesso` });
  });
};

// Remover utilizador
exports.deletarUsuario = (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM usuarios WHERE id = ? AND role != 'admin'`;
  db.run(query, [id], function(err) {
    if (err) {
      console.error('Erro ao deletar usuário:', err);
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado ou é administrador' });
    }
    res.json({ message: 'Usuário removido com sucesso' });
  });
};

// Criar novo utilizador (admin ou segurança)
exports.criarUsuario = (req, res) => {
  const { nome, email, senha, role } = req.body;
  
  if (!nome || !email || !senha || !role) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  
  if (role !== 'admin' && role !== 'seguranca' && role !== 'organizador') {
    return res.status(400).json({ error: 'Função inválida' });
  }
  
  const bcrypt = require('bcryptjs');
  const senhaHash = bcrypt.hashSync(senha, 10);
  
  const query = `INSERT INTO usuarios (nome, email, senha, role, ativo) VALUES (?, ?, ?, ?, 1)`;
  db.run(query, [nome, email, senhaHash, role], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Email já registado' });
      }
      console.error(err);
      return res.status(500).json({ error: 'Erro ao criar utilizador' });
    }
    res.status(201).json({ message: 'Utilizador criado com sucesso', id: this.lastID });
  });
};

// ==================== GESTÃO DE CRÉDITOS ====================

// Listar todos os organizadores com saldo de créditos e limites
exports.listarOrganizadoresComCreditos = (req, res) => {
  const query = `SELECT id, nome, email, creditos, limite_eventos, limite_convidados_por_evento, created_at FROM usuarios WHERE role = 'organizador' ORDER BY created_at DESC`;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao listar organizadores:', err);
      return res.status(500).json({ error: 'Erro ao listar organizadores' });
    }
    res.json(rows);
  });
};

// Editar créditos manualmente
exports.editarCreditos = (req, res) => {
  const { userId, creditos } = req.body;
  
  if (creditos === undefined || creditos < 0) {
    return res.status(400).json({ error: 'Quantidade de créditos inválida' });
  }
  
  const query = `UPDATE usuarios SET creditos = ? WHERE id = ? AND role = 'organizador'`;
  db.run(query, [creditos, userId], function(err) {
    if (err) {
      console.error('Erro ao editar créditos:', err);
      return res.status(500).json({ error: 'Erro ao editar créditos' });
    }
    
    db.run(`INSERT INTO transacoes (user_id, tipo, quantidade, descricao) VALUES (?, ?, ?, ?)`,
      [userId, 'ajuste_manual', creditos, 'Ajuste manual realizado pelo administrador']);
    
    res.json({ message: 'Créditos atualizados com sucesso', creditos });
  });
};

// ==================== TRANSAÇÕES ====================

exports.listarTransacoes = (req, res) => {
  const { userId, tipo, dataInicio, dataFim } = req.query;
  let query = `
    SELECT t.*, u.nome as usuario_nome 
    FROM transacoes t 
    JOIN usuarios u ON t.user_id = u.id 
    WHERE 1=1
  `;
  const params = [];
  
  if (userId) {
    query += ` AND t.user_id = ?`;
    params.push(userId);
  }
  if (tipo) {
    query += ` AND t.tipo = ?`;
    params.push(tipo);
  }
  if (dataInicio) {
    query += ` AND DATE(t.created_at) >= ?`;
    params.push(dataInicio);
  }
  if (dataFim) {
    query += ` AND DATE(t.created_at) <= ?`;
    params.push(dataFim);
  }
  
  query += ` ORDER BY t.created_at DESC`;
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Erro ao listar transações:', err);
      return res.status(500).json({ error: 'Erro ao listar transações' });
    }
    res.json(rows);
  });
};

// ==================== TEMPLATES IA ====================

exports.listarTemplatesIA = (req, res) => {
  const { userId } = req.query;
  let query = `
    SELECT t.*, u.nome as usuario_nome 
    FROM templates_ia t 
    JOIN usuarios u ON t.user_id = u.id 
    WHERE 1=1
  `;
  const params = [];
  
  if (userId) {
    query += ` AND t.user_id = ?`;
    params.push(userId);
  }
  
  query += ` ORDER BY t.created_at DESC`;
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Erro ao listar templates IA:', err);
      return res.status(500).json({ error: 'Erro ao listar templates IA' });
    }
    res.json(rows);
  });
};

// ==================== CONFIGURAÇÕES ====================

exports.getConfiguracoes = (req, res) => {
  // Primeiro, garantir que a tabela existe e tem registo
  db.run(`CREATE TABLE IF NOT EXISTS configuracoes (
    id INTEGER PRIMARY KEY,
    ia_ativa INTEGER DEFAULT 1,
    precos_pacotes TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) console.error('Erro ao criar configuracoes:', err);
    
    db.get(`SELECT * FROM configuracoes WHERE id = 1`, [], (err, row) => {
      if (err) {
        console.error('Erro ao buscar configurações:', err);
        return res.status(500).json({ error: 'Erro ao buscar configurações' });
      }
      
      if (!row) {
        // Criar registo padrão
        const defaultPrecos = JSON.stringify([
          { creditos: 1, preco: 1.99 },
          { creditos: 5, preco: 9.00 },
          { creditos: 10, preco: 15.00 },
          { creditos: 20, preco: 25.00 }
        ]);
        
        db.run(`INSERT INTO configuracoes (id, ia_ativa, precos_pacotes) VALUES (1, 1, ?)`,
          [defaultPrecos], (err) => {
            if (err) {
              console.error('Erro ao criar configurações padrão:', err);
              return res.status(500).json({ error: 'Erro ao criar configurações' });
            }
            res.json({
              ia_ativa: 1,
              precos_pacotes: defaultPrecos
            });
          });
      } else {
        res.json(row);
      }
    });
  });
};

exports.atualizarConfiguracoes = (req, res) => {
  const { ia_ativa, precos_pacotes } = req.body;
  
  db.run(`INSERT OR REPLACE INTO configuracoes (id, ia_ativa, precos_pacotes) VALUES (1, ?, ?)`,
    [ia_ativa ? 1 : 0, JSON.stringify(precos_pacotes)], (err) => {
      if (err) {
        console.error('Erro ao atualizar configurações:', err);
        return res.status(500).json({ error: 'Erro ao atualizar configurações' });
      }
      res.json({ message: 'Configurações atualizadas com sucesso' });
    });
};

// ==================== LOGS DE ERROS IA ====================

exports.registrarErroIA = (req, res) => {
  const { user_id, descricao, erro } = req.body;
  db.run(`INSERT INTO logs_ia (user_id, descricao, erro) VALUES (?, ?, ?)`,
    [user_id, descricao, erro], (err) => {
      if (err) console.error('Erro ao registrar log:', err);
      res.json({ message: 'Log registado' });
    });
};

exports.listarLogsIA = (req, res) => {
  const query = `
    SELECT l.*, u.nome as usuario_nome 
    FROM logs_ia l 
    LEFT JOIN usuarios u ON l.user_id = u.id 
    ORDER BY l.created_at DESC 
    LIMIT 100
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao listar logs:', err);
      return res.status(500).json({ error: 'Erro ao listar logs' });
    }
    res.json(rows);
  });
};

// ==================== LIMITES DOS ORGANIZADORES ====================

exports.atualizarLimites = (req, res) => {
  const { userId, limite_eventos, limite_convidados_por_evento } = req.body;
  
  const query = `
    UPDATE usuarios 
    SET limite_eventos = COALESCE(?, limite_eventos), 
        limite_convidados_por_evento = COALESCE(?, limite_convidados_por_evento) 
    WHERE id = ? AND role = 'organizador'
  `;
  
  db.run(query, [limite_eventos, limite_convidados_por_evento, userId], function(err) {
    if (err) {
      console.error('Erro ao atualizar limites:', err);
      return res.status(500).json({ error: 'Erro ao atualizar limites' });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Organizador não encontrado' });
    }
    
    res.json({ message: 'Limites atualizados com sucesso' });
  });
};
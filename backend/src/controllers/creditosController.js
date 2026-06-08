const db = require('../config/database');

// Obter saldo de créditos do organizador
exports.getSaldo = (req, res) => {
  const userId = req.usuario.id;
  const query = `SELECT creditos FROM usuarios WHERE id = ?`;
  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error('Erro ao buscar saldo:', err);
      return res.status(500).json({ error: 'Erro ao buscar saldo' });
    }
    res.json({ creditos: row?.creditos || 0 });
  });
};

// Comprar créditos (SIMULAÇÃO)
exports.comprarCreditos = (req, res) => {
  const { quantidade } = req.body;
  const userId = req.usuario.id;
  
  if (!quantidade || quantidade <= 0) {
    return res.status(400).json({ error: 'Quantidade inválida' });
  }
  
  const query = `UPDATE usuarios SET creditos = creditos + ? WHERE id = ?`;
  db.run(query, [quantidade, userId], function(err) {
    if (err) {
      console.error('Erro ao adicionar créditos:', err);
      return res.status(500).json({ error: 'Erro ao adicionar créditos' });
    }
    
    // Registar transação
    db.run(`INSERT INTO transacoes (user_id, tipo, quantidade, descricao) VALUES (?, ?, ?, ?)`,
      [userId, 'simulacao_compra', quantidade, `Compra simulada de ${quantidade} crédito(s)`]);
    
    res.json({ 
      message: `${quantidade} crédito(s) adicionado(s) (modo simulação)`, 
      creditos_adicionados: quantidade 
    });
  });
};
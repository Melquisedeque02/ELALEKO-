// SIMULAÇÃO: adiciona créditos sem pagamento real
exports.comprarCreditosSimulado = (req, res) => {
  const { quantidade } = req.body;
  const userId = req.usuario.id;
  
  const query = `UPDATE usuarios SET creditos = creditos + ? WHERE id = ?`;
  db.run(query, [quantidade, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao adicionar créditos' });
    }
    
    // Registar transação
    db.run(`INSERT INTO transacoes (user_id, tipo, quantidade, descricao) VALUES (?, ?, ?, ?)`,
      [userId, 'simulacao_compra', quantidade, 'Compra simulada de créditos']);
    
    res.json({ message: `${quantidade} créditos adicionados (simulação)`, creditos_adicionados: quantidade });
  });
};
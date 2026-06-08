const db = require('../config/database');

exports.getSaldoCreditos = (req, res) => {
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
//const db = require('../config/database');

// Obter limites do organizador
exports.getLimites = (req, res) => {
  const userId = req.usuario.id;
  
  db.get(`SELECT limite_eventos, limite_convidados_por_evento FROM usuarios WHERE id = ?`, [userId], (err, row) => {
    if (err) {
      console.error('Erro ao buscar limites:', err);
      return res.status(500).json({ error: 'Erro ao buscar limites' });
    }
    
    db.get(`SELECT COUNT(*) as total FROM eventos WHERE user_id = ?`, [userId], (err, countRow) => {
      if (err) {
        console.error('Erro ao contar eventos:', err);
        return res.status(500).json({ error: 'Erro ao contar eventos' });
      }
      
      res.json({
        eventos: row?.limite_eventos || 5,
        eventosUsados: countRow.total,
        convidadosPorEvento: row?.limite_convidados_por_evento || 100
      });
    });
  });
};
const db = require('../config/database');

class TipoEvento {
  static listarPorUsuario(userId, callback) {
    db.all(`SELECT * FROM tipos_evento WHERE user_id = ? ORDER BY nome`, [userId], callback);
  }
  static criar(userId, nome, callback) {
    db.run(`INSERT INTO tipos_evento (user_id, nome) VALUES (?, ?)`, [userId, nome], callback);
  }
  static atualizar(id, nome, callback) {
    db.run(`UPDATE tipos_evento SET nome = ? WHERE id = ?`, [nome, id], callback);
  }
  static deletar(id, callback) {
    db.run(`DELETE FROM tipos_evento WHERE id = ?`, [id], callback);
  }
}
module.exports = TipoEvento;
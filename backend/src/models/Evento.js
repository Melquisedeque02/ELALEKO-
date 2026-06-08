const db = require('../config/database');

class Evento {
  static criar(userId, nome_evento, data_evento, hora_evento, endereco, tipo_evento, template_padrao, manual, declaracao, pai_noivo, mae_noivo, pai_noiva, mae_noiva, callback) {
    const query = `
      INSERT INTO eventos (
        user_id, nome_evento, data_evento, hora_evento, endereco, 
        tipo_evento, template_padrao, manual, declaracao,
        pai_noivo, mae_noivo, pai_noiva, mae_noiva
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [userId, nome_evento, data_evento, hora_evento, endereco, tipo_evento, template_padrao, manual, declaracao, pai_noivo, mae_noivo, pai_noiva, mae_noiva], function(err) {
      callback(err, this?.lastID);
    });
  }

  static listarPorUsuario(userId, callback) {
    const query = `SELECT * FROM eventos WHERE user_id = ? ORDER BY created_at DESC`;
    db.all(query, [userId], callback);
  }

  static buscarPorId(id, callback) {
    const query = `SELECT * FROM eventos WHERE id = ?`;
    db.get(query, [id], callback);
  }

  static atualizar(id, nome_evento, data_evento, hora_evento, endereco, tipo_evento, template_padrao, manual, declaracao, pai_noivo, mae_noivo, pai_noiva, mae_noiva, callback) {
    const query = `
      UPDATE eventos 
      SET nome_evento = ?, data_evento = ?, hora_evento = ?, endereco = ?,
          tipo_evento = ?, template_padrao = ?, manual = ?, declaracao = ?,
          pai_noivo = ?, mae_noivo = ?, pai_noiva = ?, mae_noiva = ?
      WHERE id = ?
    `;
    db.run(query, [nome_evento, data_evento, hora_evento, endereco, tipo_evento, template_padrao, manual, declaracao, pai_noivo, mae_noivo, pai_noiva, mae_noiva, id], function(err) {
      callback(err, this.changes);
    });
  }

  static deletar(id, callback) {
    const query = `DELETE FROM eventos WHERE id = ?`;
    db.run(query, [id], function(err) {
      callback(err, this.changes);
    });
  }
}

module.exports = Evento;
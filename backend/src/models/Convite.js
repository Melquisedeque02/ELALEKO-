const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Convite {
  static criar(nome1, nome2 = null, endereco = null, nomeEvento = null, dataEvento = null, horaEvento = null, cronograma = null, manual = null, callback) {
    const uuid = uuidv4();
    const qrCode = uuid;
    
    const query = `
      INSERT INTO convites (
        uuid, nome_convidado1, nome_convidado2, qr_code, utilizado, 
        endereco, nome_evento, data_evento, hora_evento, cronograma, manual
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(query, [
      uuid, nome1, nome2, qrCode, 0,
      endereco, nomeEvento, dataEvento, horaEvento, cronograma, manual
    ], function(err) {
      if (callback && typeof callback === 'function') {
        if (err) {
          console.error('❌ Erro no INSERT:', err.message);
          callback(err, null);
        } else {
          callback(null, {
            id: this.lastID,
            uuid,
            qrCode,
            nome_convidado1: nome1,
            nome_convidado2: nome2,
            endereco,
            nome_evento: nomeEvento,
            data_evento: dataEvento,
            hora_evento: horaEvento,
            cronograma,
            manual
          });
        }
      }
    });
  }

  static buscarPorQRCode(qrCode, callback) {
    const query = `SELECT * FROM convites WHERE qr_code = ?`;
    db.get(query, [qrCode], (err, row) => {
      if (callback) callback(err, row);
    });
  }

  static marcarComoUtilizado(qrCode, callback) {
    const query = `UPDATE convites SET utilizado = 1 WHERE qr_code = ? AND utilizado = 0`;
    db.run(query, [qrCode], function(err) {
      if (callback) callback(err, this.changes);
    });
  }

  static listarTodos(callback) {
    const query = `SELECT * FROM convites ORDER BY data_criacao DESC`;
    db.all(query, [], (err, rows) => {
      if (callback) callback(err, rows);
    });
  }

  static buscarPorId(id, callback) {
    const query = `SELECT * FROM convites WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      if (callback) callback(err, row);
    });
  }

  static deletar(id, callback) {
    const query = `DELETE FROM convites WHERE id = ?`;
    db.run(query, [id], function(err) {
      if (callback) callback(err, this.changes);
    });
  }
}

module.exports = Convite;
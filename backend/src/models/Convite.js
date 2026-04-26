const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Convite {
  // Criar novo convite
  static criar(nome1, nome2 = null, callback) {
    const uuid = uuidv4();
    const qrCode = uuid;
    
    const query = `
      INSERT INTO convites (uuid, nome_convidado1, nome_convidado2, qr_code)
      VALUES (?, ?, ?, ?)
    `;
    
    db.run(query, [uuid, nome1, nome2, qrCode], function(err) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, {
          id: this.lastID,
          uuid,
          qrCode,
          nome_convidado1: nome1,
          nome_convidado2: nome2
        });
      }
    });
  }

  // Buscar convite por QR Code
  static buscarPorQRCode(qrCode, callback) {
    const query = `SELECT * FROM convites WHERE qr_code = ?`;
    db.get(query, [qrCode], callback);
  }

  // Marcar convite como utilizado
  static marcarComoUtilizado(qrCode, callback) {
    const query = `UPDATE convites SET utilizado = 1 WHERE qr_code = ? AND utilizado = 0`;
    db.run(query, [qrCode], function(err) {
      callback(err, this.changes);
    });
  }

  // Listar todos convites
  static listarTodos(callback) {
    const query = `SELECT * FROM convites ORDER BY data_criacao DESC`;
    db.all(query, [], callback);
  }

  // Buscar convite por ID
  static buscarPorId(id, callback) {
    const query = `SELECT * FROM convites WHERE id = ?`;
    db.get(query, [id], callback);
  }

  // Deletar convite
  static deletar(id, callback) {
    const query = `DELETE FROM convites WHERE id = ?`;
    db.run(query, [id], callback);
  }
}

module.exports = Convite;
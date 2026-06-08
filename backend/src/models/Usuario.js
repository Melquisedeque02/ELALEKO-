const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
  static buscarPorEmail(email, callback) {
    const query = `SELECT * FROM usuarios WHERE email = ?`;
    db.get(query, [email], callback);
  }

  static buscarPorId(id, callback) {
    const query = `SELECT id, nome, email, role, created_at FROM usuarios WHERE id = ?`;
    db.get(query, [id], callback);
  }

  static verificarSenha(senhaInformada, senhaHash) {
    return bcrypt.compareSync(senhaInformada, senhaHash);
  }

  static criar(nome, email, senha, role, callback) {
    const senhaHash = bcrypt.hashSync(senha, 10);
    const query = `INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`;
    db.run(query, [nome, email, senhaHash, role], function(err) {
      callback(err, this?.lastID);
    });
  }
}

module.exports = Usuario;
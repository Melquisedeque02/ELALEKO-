const db = require('./database');

function criarTabelaUsuarios() {
  const query = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL,
      role TEXT DEFAULT 'seguranca',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.run(query, (err) => {
    if (err) {
      console.error(' Erro ao criar tabela usuarios:', err.message);
    } else {
      console.log(' Tabela usuarios criada/verificada');
      
      // Criar usuário padrão
      const bcrypt = require('bcryptjs');
      const senhaHash = bcrypt.hashSync('123456', 10);
      
      db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`, 
        ['Administrador', 'admin@digitalinvites.com', senhaHash, 'admin'], 
        (err) => {
          if (!err) console.log(' Usuário padrão criado: admin@digitalinvites.com / 123456');
        }
      );
      
      db.run(`INSERT OR IGNORE INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`, 
        ['Segurança 1', 'seguranca1@digitalinvites.com', senhaHash, 'seguranca'], 
        (err) => {
          if (!err) console.log(' Usuário segurança criado: seguranca1@digitalinvites.com / 123456');
        }
      );
    }
  });
}

criarTabelaUsuarios();
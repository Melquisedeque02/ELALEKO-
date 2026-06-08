const db = require('./database');
const bcrypt = require('bcryptjs');

function migrar() {
  // Adicionar coluna role se não existir
  db.run(`ALTER TABLE usuarios ADD COLUMN role TEXT DEFAULT 'organizador'`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('❌ Erro ao adicionar role:', err.message);
    } else {
      console.log('✅ Coluna role verificada/adicionada');
    }
  });

  // Garantir que o admin exista
  db.get(`SELECT * FROM usuarios WHERE email = 'admin@elaleko.com'`, [], (err, row) => {
    if (!row) {
      const hash = bcrypt.hashSync('admin123', 10);
      db.run(`INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`,
        ['Administrador', 'admin@elaleko.com', hash, 'admin']);
      console.log('✅ Admin criado');
    }
  });

  // Garantir que o segurança exista
  db.get(`SELECT * FROM usuarios WHERE email = 'seguranca1@elaleko.com'`, [], (err, row) => {
    if (!row) {
      const hash = bcrypt.hashSync('123456', 10);
      db.run(`INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`,
        ['Segurança 1', 'seguranca1@elaleko.com', hash, 'seguranca']);
      console.log('✅ Segurança criado');
    }
  });
}

migrar();
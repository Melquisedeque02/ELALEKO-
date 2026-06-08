const db = require('./database');
const bcrypt = require('bcryptjs');

// Hash da senha 'admin123'
const senhaHash = bcrypt.hashSync('admin123', 10);

// Verificar se já existe
db.get(`SELECT * FROM usuarios WHERE email = ?`, ['admin@digitalinvites.com'], (err, row) => {
  if (err) {
    console.error('Erro ao verificar admin:', err.message);
    return;
  }
  
  if (row) {
    console.log('✅ Usuário admin já existe:', row.email);
  } else {
    // Criar admin
    db.run(`INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`, 
      ['Administrador Master', 'admin@digitalinvites.com', senhaHash, 'admin'], 
      function(err) {
        if (err) {
          console.error('❌ Erro ao criar admin:', err.message);
        } else {
          console.log('✅ Usuário ADMIN criado com sucesso!');
          console.log('   Email: admin@digitalinvites.com');
          console.log('   Senha: admin123');
        }
      }
    );
  }
  
  // Listar todos usuários
  db.all(`SELECT id, nome, email, role FROM usuarios`, [], (err, rows) => {
    if (!err && rows) {
      console.log('\n📋 Usuários cadastrados:');
      rows.forEach(row => {
        console.log(`   - ${row.email} (${row.role})`);
      });
    }
  });
});
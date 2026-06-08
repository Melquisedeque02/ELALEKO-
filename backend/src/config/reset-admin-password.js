const db = require('./database');
const bcrypt = require('bcryptjs');

// Nova senha
const novaSenha = 'admin123';
const senhaHash = bcrypt.hashSync(novaSenha, 10);

// Atualizar senha do admin
db.run(`UPDATE usuarios SET senha = ? WHERE email = ?`, [senhaHash, 'admin@digitalinvites.com'], function(err) {
  if (err) {
    console.error('❌ Erro ao atualizar senha:', err.message);
  } else {
    if (this.changes > 0) {
      console.log('✅ Senha do ADMIN atualizada com sucesso!');
      console.log('   Email: admin@digitalinvites.com');
      console.log('   Nova senha: admin123');
    } else {
      console.log('⚠️ Usuário admin não encontrado, criando novo...');
      
      // Se não encontrou, criar novo
      db.run(`INSERT OR REPLACE INTO usuarios (id, nome, email, senha, role) VALUES (1, 'Administrador Master', 'admin@digitalinvites.com', ?, 'admin')`, 
        [senhaHash], 
        function(err) {
          if (err) {
            console.error('❌ Erro ao criar admin:', err.message);
          } else {
            console.log('✅ Usuário ADMIN recriado com sucesso!');
          }
        }
      );
    }
  }
  
  // Verificar a senha atual
  db.get(`SELECT email, senha FROM usuarios WHERE email = 'admin@digitalinvites.com'`, [], (err, row) => {
    if (!err && row) {
      const isValid = bcrypt.compareSync('admin123', row.senha);
      console.log(`\n🧪 Teste de senha: ${isValid ? '✅ VÁLIDA' : '❌ INVÁLIDA'}`);
    }
  });
});
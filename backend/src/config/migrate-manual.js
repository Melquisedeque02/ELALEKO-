const db = require('./database');

function adicionarColunaManual() {
  db.run(`ALTER TABLE convites ADD COLUMN manual TEXT`, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log('✅ Coluna manual já existe');
      } else {
        console.log('❌ Erro ao adicionar coluna manual:', err.message);
      }
    } else {
      console.log('✅ Coluna manual adicionada com sucesso');
    }
  });
}

adicionarColunaManual();
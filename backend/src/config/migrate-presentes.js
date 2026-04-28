const db = require('./database');

function adicionarColunaPresentes() {
  db.run(`ALTER TABLE convites ADD COLUMN presentes TEXT`, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log(' Coluna presentes já existe');
      } else {
        console.log(' Erro ao adicionar coluna presentes:', err.message);
      }
    } else {
      console.log(' Coluna presentes adicionada com sucesso');
    }
  });
}

adicionarColunaPresentes();
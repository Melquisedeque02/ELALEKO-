const db = require('./database');

function adicionarColunaDeclaracao() {
  db.run(`ALTER TABLE convites ADD COLUMN declaracao TEXT`, (err) => {
    if (err) {
      if (err.message.includes('duplicate column name')) {
        console.log(' Coluna declaracao já existe');
      } else {
        console.log(' Erro ao adicionar coluna declaracao:', err.message);
      }
    } else {
      console.log(' Coluna declaracao adicionada com sucesso');
    }
  });
}

adicionarColunaDeclaracao();
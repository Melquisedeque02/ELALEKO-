const db = require('./database');

function adicionarColunasPais() {
  const colunas = [
    'pai_noivo TEXT',
    'mae_noivo TEXT', 
    'pai_noiva TEXT',
    'mae_noiva TEXT'
  ];
  
  colunas.forEach(coluna => {
    db.run(`ALTER TABLE convites ADD COLUMN ${coluna}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.log(`❌ Erro ao adicionar ${coluna}:`, err.message);
      } else if (!err) {
        console.log(`✅ Coluna ${coluna} adicionada`);
      }
    });
  });
}

adicionarColunasPais();
const db = require('./database');

db.run(`ALTER TABLE convites ADD COLUMN evento_id INTEGER REFERENCES eventos(id)`, (err) => {
  if (!err || err.message.includes('duplicate')) console.log('✅ Coluna evento_id adicionada à tabela convites');
  else console.error('Erro ao adicionar evento_id:', err.message);
});
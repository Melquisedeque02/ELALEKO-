const db = require('./database');

db.run(`ALTER TABLE usuarios ADD COLUMN ativo INTEGER DEFAULT 1`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('❌ Erro ao adicionar coluna ativo:', err.message);
  } else {
    console.log('✅ Coluna "ativo" adicionada com sucesso (1 = ativo, 0 = inativo)');
  }
});
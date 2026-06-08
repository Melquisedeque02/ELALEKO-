const db = require('./database');

db.run(`ALTER TABLE usuarios ADD COLUMN creditos INTEGER DEFAULT 0`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('❌ Erro ao adicionar coluna creditos:', err.message);
  } else {
    console.log('✅ Coluna "creditos" adicionada com sucesso');
  }
});
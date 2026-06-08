const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../../database/qrinvite.db');
const db = new sqlite3.Database(dbPath);

db.run(`ALTER TABLE convites ADD COLUMN template TEXT DEFAULT 'classico'`, (err) => {
  if (err && !err.message.includes('duplicate column name')) {
    console.error('❌ Erro ao adicionar coluna template:', err.message);
  } else {
    console.log('✅ Coluna "template" adicionada com sucesso');
  }
  db.close();
});
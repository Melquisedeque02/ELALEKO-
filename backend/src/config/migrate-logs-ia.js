const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../../database/qrinvite.db');
const db = new sqlite3.Database(dbPath);

db.run(`
  CREATE TABLE IF NOT EXISTS logs_ia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    descricao TEXT,
    erro TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE SET NULL
  )
`, (err) => {
  if (err) console.error('❌ Erro ao criar logs_ia:', err.message);
  else console.log('✅ Tabela "logs_ia" criada');
  db.close();
});
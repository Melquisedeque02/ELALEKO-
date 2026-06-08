const db = require('./database');

db.run(`
  CREATE TABLE IF NOT EXISTS eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    nome_evento TEXT NOT NULL,
    data_evento TEXT,
    hora_evento TEXT,
    endereco TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
  )
`, (err) => {
  if (err) console.error('❌ Erro ao criar eventos:', err.message);
  else console.log('✅ Tabela eventos criada');
});
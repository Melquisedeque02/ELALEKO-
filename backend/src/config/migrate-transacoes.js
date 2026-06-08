const db = require('./database');

db.run(`
  CREATE TABLE IF NOT EXISTS transacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tipo TEXT NOT NULL,
    quantidade INTEGER NOT NULL,
    valor REAL,
    descricao TEXT,
    payment_intent_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
  )
`, (err) => {
  if (err) console.error('❌ Erro ao criar transacoes:', err.message);
  else console.log('✅ Tabela "transacoes" criada com sucesso');
});
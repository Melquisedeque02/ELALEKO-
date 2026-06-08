const db = require('./database');

db.run(`
  CREATE TABLE IF NOT EXISTS templates_ia (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    imagem_url TEXT,
    html_css TEXT,
    creditos_gastos INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
  )
`, (err) => {
  if (err) console.error('❌ Erro ao criar templates_ia:', err.message);
  else console.log('✅ Tabela "templates_ia" criada com sucesso');
});
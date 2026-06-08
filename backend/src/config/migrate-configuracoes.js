const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../../database/qrinvite.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS configuracoes (
      id INTEGER PRIMARY KEY,
      ia_ativa INTEGER DEFAULT 1,
      precos_pacotes TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) console.error('❌ Erro:', err.message);
    else console.log('✅ Tabela configuracoes criada/verificada');
  });

  db.run(`INSERT OR IGNORE INTO configuracoes (id, ia_ativa, precos_pacotes) 
    VALUES (1, 1, '[{"creditos":1,"preco":1.99},{"creditos":5,"preco":9.00},{"creditos":10,"preco":15.00},{"creditos":20,"preco":25.00}]')`, 
    (err) => {
      if (err) console.error('❌ Erro ao inserir padrão:', err);
      else console.log('✅ Configuração padrão inserida');
    });
});

db.close();
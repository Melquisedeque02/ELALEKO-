const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Garantir que a pasta database existe
const databaseDir = path.join(__dirname, '../../database');
if (!fs.existsSync(databaseDir)) {
  fs.mkdirSync(databaseDir, { recursive: true });
}

const dbPath = path.join(databaseDir, 'qrinvite.db');
console.log('📁 Banco de dados:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar:', err.message);
  } else {
    console.log('✅ Conectado ao SQLite');
    criarTabelas();
  }
});

function criarTabelas() {
  // Tabela de convites com TODAS as colunas
  const criarTabelaConvites = `
    CREATE TABLE IF NOT EXISTS convites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uuid TEXT UNIQUE NOT NULL,
      nome_convidado1 TEXT NOT NULL,
      nome_convidado2 TEXT,
      qr_code TEXT UNIQUE NOT NULL,
      utilizado INTEGER DEFAULT 0,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
      endereco TEXT,
      nome_evento TEXT,
      data_evento TEXT,
      hora_evento TEXT,
      cronograma TEXT,
      manual TEXT
    )
  `;

  db.run(criarTabelaConvites, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela convites:', err.message);
    } else {
      console.log('✅ Tabela "convites" criada/verificada');
      console.log('📋 Colunas: id, uuid, nome_convidado1, nome_convidado2, qr_code, utilizado, data_criacao, endereco, nome_evento, data_evento, hora_evento, cronograma');
    }
  });
}

module.exports = db;
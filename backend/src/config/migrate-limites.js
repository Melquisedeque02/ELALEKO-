const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../../database/qrinvite.db');
const db = new sqlite3.Database(dbPath);

// Adicionar colunas na tabela usuarios
db.run(`ALTER TABLE usuarios ADD COLUMN limite_eventos INTEGER DEFAULT 5`, (err) => {
  if (err && !err.message.includes('duplicate column name')) console.error('❌ Erro limite_eventos:', err.message);
  else console.log('✅ Coluna limite_eventos adicionada');
});

db.run(`ALTER TABLE usuarios ADD COLUMN limite_convidados_por_evento INTEGER DEFAULT 1000`, (err) => {
  if (err && !err.message.includes('duplicate column name')) console.error('❌ Erro limite_convidados_por_evento:', err.message);
  else console.log('✅ Coluna limite_convidados_por_evento adicionada');
});

// Adicionar coluna na tabela eventos para limite personalizado (opcional)
db.run(`ALTER TABLE eventos ADD COLUMN limite_convidados INTEGER`, (err) => {
  if (err && !err.message.includes('duplicate column name')) console.error('❌ Erro limite_convidados (eventos):', err.message);
  else console.log('✅ Coluna limite_convidados na tabela eventos adicionada');
});

db.close();
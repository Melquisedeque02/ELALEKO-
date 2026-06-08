const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../../database/qrinvite.db');
const db = new sqlite3.Database(dbPath);

// Lista de colunas a adicionar
const colunas = [
  { nome: 'tipo_evento', tipo: "TEXT DEFAULT 'outro'" },
  { nome: 'template_padrao', tipo: "TEXT DEFAULT 'classico'" },
  { nome: 'manual', tipo: 'TEXT' },
  { nome: 'declaracao', tipo: 'TEXT' },
  { nome: 'pai_noivo', tipo: 'TEXT' },
  { nome: 'mae_noivo', tipo: 'TEXT' },
  { nome: 'pai_noiva', tipo: 'TEXT' },
  { nome: 'mae_noiva', tipo: 'TEXT' }
];

let pendentes = colunas.length;

colunas.forEach(coluna => {
  db.run(`ALTER TABLE eventos ADD COLUMN ${coluna.nome} ${coluna.tipo}`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error(`❌ Erro ao adicionar ${coluna.nome}:`, err.message);
    } else if (!err) {
      console.log(`✅ Coluna "${coluna.nome}" adicionada`);
    }
    pendentes--;
    if (pendentes === 0) {
      console.log('🎉 Migração concluída!');
      db.close();
    }
  });
});
const db = require('./database');

db.serialize(() => {
  db.run(`ALTER TABLE usuarios ADD COLUMN reset_token TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('❌ Erro ao adicionar reset_token:', err.message);
    } else if (!err) {
      console.log('✅ Coluna reset_token adicionada');
    }
  });

  db.run(`ALTER TABLE usuarios ADD COLUMN reset_expires DATETIME`, (err) => {
    if (err && !err.message.includes('duplicate column name')) {
      console.error('❌ Erro ao adicionar reset_expires:', err.message);
    } else if (!err) {
      console.log('✅ Coluna reset_expires adicionada');
    }
  });
});
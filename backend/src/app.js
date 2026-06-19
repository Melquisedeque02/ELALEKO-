const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const bcrypt = require('bcryptjs'); // <-- ADICIONADO para hash

// Importar configurações
const db = require('./config/database'); // <-- MODIFICADO: agora guarda a conexão
const convitesRoutes = require('./routes/convitesRoutes');
const authRoutes = require('./routes/authRoutes');
const eventosRoutes = require('./routes/eventosRoutes');
const adminRoutes = require('./routes/adminRoutes');
const organizadorRoutes = require('./routes/organizadorRoutes');
//const creditosRoutes = require('./routes/creditosRoutes');
//const iaRoutes = require('./routes/iaRoutes');
const tipoEventoRoutes = require('./routes/tipoEventoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(xss());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rotas
app.use('/api', convitesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/organizador', organizadorRoutes);
//app.use('/api/creditos', creditosRoutes);
//app.use('/api/ia', iaRoutes);
app.use('/api/tipos-evento', tipoEventoRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ 
    message: ' QR Invite API está funcionando!',
    version: '1.0.0',
    endpoints: {
      criar: 'POST /api/convites',
      listar: 'GET /api/convites',
      validar: 'GET /api/convites/:qrCode',
      utilizar: 'PATCH /api/convites/:qrCode/utilizar',
      deletar: 'DELETE /api/convites/:id',
      login: 'POST /api/auth/login'
    }
  });
});

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================================
// 🔧 CRIAÇÃO AUTOMÁTICA DO ADMIN (somente se não houver usuários)
// ============================================================
function criarAdminSeNecessario() {
  // Verificar se já existe algum usuário na tabela
  db.get('SELECT COUNT(*) as total FROM usuarios', (err, row) => {
    if (err) {
      console.error('❌ Erro ao verificar usuários existentes:', err.message);
      return;
    }

    // Se já houver usuários, não criar admin (evita sobrescrever)
    if (row.total > 0) {
      console.log(`✅ ${row.total} usuário(s) já cadastrado(s). Nenhum admin criado.`);
      return;
    }

    // Pegar credenciais do ambiente (com fallback seguro)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@digitalinvites.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin935006';
    const adminName = process.env.ADMIN_NAME || 'Administrador';

    // Hash da senha
    const saltRounds = 10;
    const senhaHash = bcrypt.hashSync(adminPassword, saltRounds);

    // Inserir admin
    db.run(
      `INSERT INTO usuarios (nome, email, senha, role, ativo) 
       VALUES (?, ?, ?, ?, ?)`,
      [adminName, adminEmail, senhaHash, 'admin', 1],
      function(err) {
        if (err) {
          console.error('❌ Erro ao criar admin:', err.message);
        } else {
          console.log('✅ ADMIN CRIADO COM SUCESSO!');
          console.log(`📧 Email: ${adminEmail}`);
          console.log(`🔑 Senha: ${adminPassword}`);
          console.log('⚠️  Altere a senha após o primeiro login!');
        }
      }
    );
  });
}

// Executar a criação do admin APÓS a conexão com o banco estar estabelecida
// O banco já foi importado no início (db = require('./config/database'))
// Mas precisamos garantir que a tabela exista. A criação das tabelas é feita no database.js
// Vamos chamar a função após um pequeno delay para garantir que a tabela foi criada
setTimeout(() => {
  criarAdminSeNecessario();
}, 1000); // Aguarda 1 segundo para garantir que a tabela foi criada

// ============================================================

// Rate limiting para login (5 tentativas a cada 15 minutos)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Muitas tentativas de login. Tente novamente mais tarde.' },
  skipSuccessfulRequests: true,
});
app.use('/api/auth/login', authLimiter);

// Desativar logs detalhados em produção
if (process.env.NODE_ENV === 'production') {
  console.log = function() {};
  console.info = function() {};
  console.debug = function() {};
}

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` API: http://localhost:${PORT}/api`);
  console.log(` Health: http://localhost:${PORT}/health`);
});
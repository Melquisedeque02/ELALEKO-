const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');

// Importar configurações
require('./config/database');
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

// Segurança: headers HTTP seguros
app.use(helmet());

// Proteção contra XSS via input
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
// Servir arquivos estáticos da pasta uploads
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

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(` Servidor rodando na porta ${PORT}`);
  console.log(` API: http://localhost:${PORT}/api`);
  console.log(` Health: http://localhost:${PORT}/health`);
});

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
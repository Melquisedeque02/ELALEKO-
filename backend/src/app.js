const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar configurações
require('./config/database');
const convitesRoutes = require('./routes/convitesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rotas
app.use('/api', convitesRoutes);

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
      deletar: 'DELETE /api/convites/:id'
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
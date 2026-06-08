const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');

// Todas as rotas exigem autenticação e role = 'admin'
router.use(authController.verificarToken);
router.use((req, res, next) => {
  if (req.usuario.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
});

router.get('/usuarios', adminController.listarUsuarios);
router.patch('/usuarios/status', adminController.alterarStatusUsuario);
router.delete('/usuarios/:id', adminController.deletarUsuario);
router.post('/usuarios', adminController.criarUsuario);

// ==================== CRÉDITOS ====================
router.get('/organizadores/creditos', adminController.listarOrganizadoresComCreditos);
router.put('/organizadores/creditos', adminController.editarCreditos);

// ==================== TRANSAÇÕES ====================
router.get('/transacoes', adminController.listarTransacoes);

// ==================== TEMPLATES IA ====================
router.get('/templates-ia', adminController.listarTemplatesIA);

// ==================== CONFIGURAÇÕES ====================
router.get('/configuracoes', adminController.getConfiguracoes);
router.put('/configuracoes', adminController.atualizarConfiguracoes);

// ==================== LOGS IA ====================
router.post('/logs-ia', adminController.registrarErroIA);
router.get('/logs-ia', adminController.listarLogsIA);

router.put('/organizadores/limites', adminController.atualizarLimites);

module.exports = router;
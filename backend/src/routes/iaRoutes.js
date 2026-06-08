const express = require('express');
const router = express.Router();
const iaController = require('../controllers/iaController');
const authController = require('../controllers/authController');

// Todas as rotas exigem autenticação
router.use(authController.verificarToken);

// Apenas organizadores podem gerar templates IA
router.use((req, res, next) => {
  if (req.usuario.role !== 'organizador') {
    return res.status(403).json({ error: 'Acesso negado. Apenas organizadores.' });
  }
  next();
});

router.post('/gerar-template', iaController.gerarTemplate);
router.get('/templates', iaController.listarTemplates);

module.exports = router;
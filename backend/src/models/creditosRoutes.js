const express = require('express');
const router = express.Router();
const creditosController = require('../controllers/creditosController');
const authController = require('../controllers/authController');

// Todas as rotas exigem autenticação
router.use(authController.verificarToken);

// Apenas organizadores podem comprar/ver créditos
router.use((req, res, next) => {
  if (req.usuario.role !== 'organizador') {
    return res.status(403).json({ error: 'Acesso negado. Apenas organizadores.' });
  }
  next();
});

router.get('/saldo', creditosController.getSaldo);
router.post('/comprar', creditosController.comprarCreditos);

module.exports = router;
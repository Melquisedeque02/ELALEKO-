const express = require('express');
const router = express.Router();
const organizadorController = require('../controllers/organizadorController');
const authController = require('../controllers/authController');

router.use(authController.verificarToken);
router.use((req, res, next) => {
  if (req.usuario.role !== 'organizador') {
    return res.status(403).json({ error: 'Acesso negado' });
  }
  next();
});

router.get('/saldo', organizadorController.getSaldoCreditos);
router.get('/limites', organizadorController.getLimites);

module.exports = router;
const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const authController = require('../controllers/authController');

// Todas as rotas exigem autenticação
router.use(authController.verificarToken);

// Apenas organizadores podem aceder
router.use((req, res, next) => {
  if (req.usuario.role !== 'organizador') {
    return res.status(403).json({ error: 'Acesso negado. Apenas organizadores.' });
  }
  next();
});

router.post('/', eventosController.criarEvento);
router.get('/', eventosController.listarEventos);
router.get('/:id', eventosController.buscarEventoPorId);  // ← NOVA ROTA
router.put('/:id', eventosController.atualizarEvento);
router.delete('/:id', eventosController.deletarEvento);

module.exports = router;
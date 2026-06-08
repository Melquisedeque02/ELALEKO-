const express = require('express');
const router = express.Router();
const tipoEventoController = require('../controllers/tipoEventoController');
const authController = require('../controllers/authController');

router.use(authController.verificarToken);
router.get('/', tipoEventoController.listar);
router.post('/', tipoEventoController.criar);
router.put('/:id', tipoEventoController.atualizar);
router.delete('/:id', tipoEventoController.deletar);

module.exports = router;
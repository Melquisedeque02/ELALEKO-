const express = require('express');
const router = express.Router();
const convitesController = require('../controllers/convitesController');

// Rotas da API
router.post('/convites', convitesController.criarConvite);
router.get('/convites', convitesController.listarConvites);
router.get('/convites/:qrCode', convitesController.validarConvite);
router.patch('/convites/:qrCode/utilizar', convitesController.utilizarConvite);
router.delete('/convites/:id', convitesController.deletarConvite);

module.exports = router;
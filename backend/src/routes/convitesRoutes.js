const express = require('express');
const router = express.Router();
const convitesController = require('../controllers/convitesController');
const authController = require('../controllers/authController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


// Rota pública (NÃO exige autenticação)
router.get('/convites/publico/:qrCode', convitesController.validarConvitePublico);

// Rotas protegidas (exigem autenticação) - APLICAR MIDDLEWARE INDIVIDUALMENTE
router.post('/convites', authController.verificarToken, convitesController.criarConvite);
router.get('/convites', authController.verificarToken, convitesController.listarConvites);
router.get('/convites/:id', authController.verificarToken, convitesController.buscarConvitePorId);
router.put('/convites/:id', authController.verificarToken, convitesController.atualizarConvite);
router.delete('/convites/:id', authController.verificarToken, convitesController.deletarConvite);
router.get('/convites/evento/:eventoId', authController.verificarToken, convitesController.listarConvitesPorEvento);
router.get('/convites/evento/:eventoId/download-all', authController.verificarToken, convitesController.baixarTodosConvites);

// Rotas para segurança (validação)
router.get('/convites/validar/:qrCode', authController.verificarToken, convitesController.validarConviteProtegido);
router.patch('/convites/:qrCode/utilizar', authController.verificarToken, convitesController.utilizarConvite);

router.post('/convites/evento/:eventoId/importar', 
  authController.verificarToken, 
  upload.single('file'), 
  convitesController.importarConvites
);

module.exports = router;
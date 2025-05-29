const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.get('/', usuarioController.listarUsuarios);
router.post('/', usuarioController.crearUsuario);
router.post('/login', usuarioController.login);
router.get('/:email', usuarioController.obtenerUsuarioPorEmail);

module.exports = router;


const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/', pedidoController.crearPedido);
router.get('/', pedidoController.listarPedido);
router.get('/:id', pedidoController.obtenerPedido);
router.put('/:id', pedidoController.actualizarPedido);

module.exports = router; 
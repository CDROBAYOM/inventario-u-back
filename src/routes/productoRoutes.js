const express = require('express');
const router = express.Router();
const { productoController, upload } = require('../controllers/productoController');

router.post('/', upload.single('imagen'), productoController.crearProducto);
router.get('/', productoController.listarProductos);
router.get('/:id', productoController.obtenerProducto);
router.put('/:id', upload.single('imagen'), productoController.actualizarProducto);
router.delete('/:id', productoController.eliminarProducto);

module.exports = router; 
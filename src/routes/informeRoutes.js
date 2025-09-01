const express = require('express');
const router = express.Router();
const informeController = require('../controllers/informeController');

// Ruta para obtener solo las columnas específicas (cantidad, stockactual, estado)
router.get('/stock', informeController.obtenerStock);

module.exports = router; 
const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Inventory = require('../models/Inventory');

// Create a new order
router.post('/', async (req, res) => {

  try {    
    // Validar que todos los items existan en el inventario y tengan suficiente cantidad
    for (const item of req.body) {
      const inventoryItem = await Inventory.findById(item.id);
      console.log(inventoryItem);
      if (!inventoryItem) {
        return res.status(404).json({ 
          message: `Producto con ID ${item.id} no encontrado en el inventario` 
        });
      }
      if (inventoryItem.quantity < item.cantidadSolicitada) {
        return res.status(400).json({ 
          message: `Cantidad insuficiente para el producto ${inventoryItem.name}. Disponible: ${inventoryItem.quantity}, Solicitado: ${item.cantidadSolicitada}` 
        });
      }
    }
    
    // Crear la orden
    const order = new Order({
      items: req.body
    });
    
    console.log(order);

    // Guardar la orden
    await order.save();

    // Actualizar el inventario
    for (const item of req.body) {
      await Inventory.findByIdAndUpdate(
        item.id,
        { $inc: { quantity: -item.cantidadSolicitada } },
        { new: true }
      );
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an order
router.put('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { items: req.body },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update delivery status
router.patch('/:id/status', async (req, res) => {
  try {
    const { deliveryStatus } = req.body;
    
    if (!['PENDIENTE', 'EN_PROCESO', 'ENTREGADO', 'CANCELADO'].includes(deliveryStatus)) {
      return res.status(400).json({ 
        message: 'Estado de entrega inválido. Debe ser: PENDIENTE, EN_PROCESO, ENTREGADO o CANCELADO' 
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 
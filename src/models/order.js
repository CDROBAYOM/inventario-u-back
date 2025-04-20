const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  items: [{
    id: {
      type: String,
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    categoria: {
      type: String,
      required: true
    },
    cantidadSolicitada: {
      type: Number,
      required: true,
      min: 1
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema); 
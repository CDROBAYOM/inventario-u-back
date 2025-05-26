const { PedidoServices } = require('../services/pedidoServices');

const pedidoController = {

    async crearPedido(req, res) {
        try {            
            const pedido = await PedidoServices.create(req.body);
            res.status(201).json(pedido);
        } catch (error) {            
            res.status(400).json({ error: error.message });
        }
    },

    async listarPedido(req, res) {
        try {
            const pedido = await PedidoServices.findAll();
            res.status(200).json(pedido);   
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async obtenerPedido(req, res) {
        try {
            const pedido = await PedidoServices.findById(req.params.id);
            res.status(200).json(pedido);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async actualizarPedido(req, res) {
        try {
            const pedido = await PedidoServices.update(req.params.id, req.body);
            res.status(200).json(pedido);
        } catch (error) {
            res.status(400).json({ error: error.message }); 
        }
    }
}

module.exports = pedidoController;
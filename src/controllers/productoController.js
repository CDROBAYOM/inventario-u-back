const { ProductoServices } = require('../services/productoServices');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const productoController = {
    
    async crearProducto(req, res) {
        try {            
            const producto = await ProductoServices.create(req.body, req.file);
            res.status(201).json(producto);
        } catch (error) {            
            res.status(400).json({ error: error.message });
        }
    },

    async obtenerProducto(req, res) {
        try {
            console.log("obtenerProducto", req.params.id);
            const producto = await ProductoServices.findById(req.params.id);
            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json(producto);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async listarProductos(req, res) {
        try {
            console.log("listarProductos");
            const productos = await ProductoServices.findAll();
            console.log("productos", productos);
            res.json(productos);
        } catch (error) {            
            res.status(400).json({ error: error.message });
        }
    },

    async actualizarProducto(req, res) {
        try {
            const producto = await ProductoServices.update(req.params.id, req.body, req.file);
            res.json(producto);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async eliminarProducto(req, res) {
        try {
            await ProductoServices.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};

module.exports = { productoController, upload }; 
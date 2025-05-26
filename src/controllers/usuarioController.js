const { UsuarioServices } = require('../services/usuarioServices');

const usuarioController = {

    async listarUsuarios(req, res) {
        try {
            const usuarios = await UsuarioServices.findAll();
            res.status(200).json(usuarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async crearUsuario(req, res) {
        try {
            const usuario = await UsuarioServices.create(req.body);
            res.status(201).json(usuario);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = usuarioController;

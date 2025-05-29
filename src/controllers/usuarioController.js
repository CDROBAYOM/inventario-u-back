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
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            console.log(email, password);
            console.log(req.body);
            
            if (!email || !password) {
                return res.status(400).json({ error: 'Email y contraseña son requeridos' });
            }

            const result = await UsuarioServices.login(email, password);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    },

    async obtenerUsuarioPorEmail(req, res) {
        try {
            console.log(req.params);
            const { email } = req.params;
            const usuario = await UsuarioServices.findByEmail(email);
            res.status(200).json(usuario);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = usuarioController;

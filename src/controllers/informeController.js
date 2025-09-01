const InformeServices = require('../services/informeServices');

const informeController = {    
    
    async obtenerStock(req, res) {
        try {
            console.log("obtenerStock");
            const columnas = await InformeServices.findSpecificColumns();            
            res.json(columnas);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

}

module.exports = informeController;
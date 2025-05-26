const dynamoDB = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');
const { ScanCommand, GetCommand, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const EstadoUsuario = require('../enums/estadoUsuario');

class UsuarioServices {

    static async findAll() {        
        const params = {
            TableName: 'usuarios'
        };

        try {
            const command = new ScanCommand(params);
            const result = await dynamoDB.send(command);
            return result.Items;
        } catch (error) {
            console.error("Error al listar usuarios:", error);
            throw error;
        }
    }
    
    static async create(usuario) {
        if (!Object.values(EstadoUsuario).includes(usuario.estado)) {
            throw new Error(`Estado inválido. Los estados válidos son: ${Object.values(EstadoUsuario).join(', ')}`);
        }
        
        const item = {
            usuarioId: uuidv4(),
            nombre: usuario.nombre,
            email: usuario.email,
            password: usuario.password,
            coordinacion: usuario.coordinacion,
            rol: usuario.rol,
            estado: usuario.estado,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        const params = {
            TableName: 'usuarios',
            Item: item
        };

        const command = new PutCommand(params); 
        await dynamoDB.send(command);
        return params.Item;
    }

}

module.exports = { UsuarioServices };
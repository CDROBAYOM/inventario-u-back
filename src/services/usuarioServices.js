const dynamoDB = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');
const { ScanCommand, GetCommand, PutCommand, UpdateCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const EstadoUsuario = require('../enums/estadoUsuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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

    static async login(email, password) {

        console.log("email: " + email);
        console.log("password: " + password);

        const params = {
            TableName: 'usuarios',
            IndexName: 'emailIndex',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        };

        try {
            const command = new QueryCommand(params);
            const result = await dynamoDB.send(command);    
            
            if (!result.Items || result.Items.length === 0) {
                throw new Error('Usuario no encontrado');
            }

            const usuario = result.Items[0];
            
            // Verificar si el usuario está activo
            if (usuario.estado !== EstadoUsuario.ACTIVO) {
                throw new Error('Usuario inactivo o bloqueado');
            }

            // Verificar la contraseña
/*             const passwordMatch = await bcrypt.compare(password, usuario.password);
            if (!passwordMatch) {
                throw new Error('Contraseña incorrecta');
            } */
           if(password !== usuario.password) {
            throw new Error('Contraseña incorrecta');
           }

            // Generar token JWT
            const token = jwt.sign(
                { 
                    usuarioId: usuario.usuarioId,
                    email: usuario.email,
                    rol: usuario.rol
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            return {
                token,
                usuario: {
                    usuarioId: usuario.usuarioId,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    rol: usuario.rol,
                    coordinacion: usuario.coordinacion
                }
            };
        } catch (error) {
            console.error("Error en login:", error);
            throw error;
        }
    }

}

module.exports = { UsuarioServices };
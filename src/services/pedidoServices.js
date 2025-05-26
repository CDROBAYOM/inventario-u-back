const dynamoDB = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');
const { ScanCommand, GetCommand, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const EstadoPedido = require('../enums/estadoPedido');

class PedidoServices {
    
    static async findAll() {
        const params = {
            TableName: 'pedidos'
        };

        try {
            const command = new ScanCommand(params);
            const result = await dynamoDB.send(command);
            return result.Items;
        } catch (error) {
            console.error("Error al listar pedidos:", error);
            throw error;
        }
    }

    static async create(pedido) {
        if (!Object.values(EstadoPedido).includes(pedido.estado)) {
            throw new Error(`Estado inválido. Los estados válidos son: ${Object.values(EstadoPedido).join(', ')}`);
        }

        const item = {
            pedidoId: uuidv4(),
            estado: pedido.estado,
            coordinacionId: pedido.coordinacionId,
            cantidad: pedido.cantidad,
            fecha: pedido.fecha,
            total: pedido.total,
            clienteId: pedido.clienteId,
            productos: pedido.productos || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Campos opcionales
        if (pedido.personaQueRecogio) {
            item.personaQueRecogio = pedido.personaQueRecogio;
        }
        if (pedido.observaciones) {
            item.observaciones = pedido.observaciones;
        }

        const params = {
            TableName: 'pedidos',
            Item: item
        };

        try {
            const command = new PutCommand(params);
            await dynamoDB.send(command);
            return params.Item;
        } catch (error) {
            console.error("Error al crear pedido:", error);
            throw error;
        }
    }

    static async findById(id) {
        const params = {
            TableName: 'pedidos',
            Key: {
                pedidoId: id
            }
        };

        try {
            const command = new GetCommand(params);
            const result = await dynamoDB.send(command);
            return result.Item;
        } catch (error) {
            console.error("Error al obtener pedido:", error);
            throw error;
        }
    }

    static async update(id, pedido) {
        if (pedido.estado && !Object.values(EstadoPedido).includes(pedido.estado)) {
            throw new Error(`Estado inválido. Los estados válidos son: ${Object.values(EstadoPedido).join(', ')}`);
        }

        console.log("pedido para actualizar", pedido);

        const updateExpression = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        // Lista de campos permitidos para actualizar
        const allowedFields = [
            'estado',
            'coordinacionId',
            'cantidad',
            'fecha',
            'total',
            'clienteId',
            'productos',
            'personaQueRecogio',
            "updatedAt",
            'observaciones'
        ];
        
        allowedFields.forEach(field => {
            if (pedido[field] !== undefined) {
                updateExpression.push(`#${field} = :${field}`);
                expressionAttributeValues[`:${field}`] = pedido[field];
                expressionAttributeNames[`#${field}`] = field;
            }
        });

        if (updateExpression.length === 0) {
            throw new Error('No hay campos válidos para actualizar');
        }

        updateExpression.push('#updatedAt = :updatedAt');
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();
        expressionAttributeNames['#updatedAt'] = 'updatedAt';

        const params = {
            TableName: 'pedidos',
            Key: {
                pedidoId: id
            },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeValues: expressionAttributeValues,
            ExpressionAttributeNames: expressionAttributeNames,
            ReturnValues: 'ALL_NEW'
        };

        try {
            const command = new UpdateCommand(params);
            const result = await dynamoDB.send(command);
            return result.Attributes;
        } catch (error) {
            console.error("Error al actualizar pedido:", error);
            throw error;
        }
    }
}

module.exports = { PedidoServices };
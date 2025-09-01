const dynamoDB = require('../config/dynamodb');
const { ScanCommand, GetCommand, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

class InformeServices {

    static async findSpecificColumns() {
        const params = {
            TableName: 'productos',
            ProjectionExpression: '#stockActual, #estado, #nombre',
            ExpressionAttributeNames: {                
                '#stockActual': 'stockActual',
                '#estado': 'estado',
                '#nombre': 'nombre'
            }
        };
        try {
            const command = new ScanCommand(params);
            const result = await dynamoDB.send(command);
            console.log("result", result.Items);
            return result.Items;
        } catch (error) {
            console.error("Error al obtener columnas específicas de pedidos:", error);
            throw error;
        }
    }
}

module.exports = InformeServices;

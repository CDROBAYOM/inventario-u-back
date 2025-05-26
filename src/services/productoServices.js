const dynamoDB = require('../config/dynamodb');
const s3Client = require('../config/s3');
const { v4: uuidv4 } = require('uuid');
const { ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const EstadoProducto = require('../enums/estadoProducto');

class ProductoServices {

    static async findAll() {
        
        const params = {
            TableName: 'productos'
        };

        try {
            const command = new ScanCommand(params);
            const result = await dynamoDB.send(command);            
            return result.Items;
        } catch (error) {
            console.error("Error al listar productos:", error);
            throw error;
        }
    }

    static async findById(id) {
        console.log("findById", id);
        const params = {
            TableName: 'productos',
            Key: {
                productoId: id
            }
        };

        try {
            const command = new GetCommand(params);
            const result = await dynamoDB.send(command);
            return result.Item;
        } catch (error) {
            console.error("Error al obtener producto:", error);
            throw error;
        }
    }

    static async uploadImageToS3(file, productId) {        
        const fileExtension = file.originalname.split('.').pop();
        const key = `products/${productId}.${fileExtension}`;
        
        const params = {
            Bucket: 'inventario-u',
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        };

        try {            
            await s3Client.send(new PutObjectCommand(params));
            return `https://${'inventario-u'}.s3.${'us-east-1'}.amazonaws.com/${key}`;
        } catch (error) {
            console.error("Error al subir imagen a S3:", error);
            throw error;
        }
    }

    static async create(producto, file) {
        console.log("producto", producto);
        if (!Object.values(EstadoProducto).includes(producto.estado)) {
            throw new Error(`Estado inválido. Los estados válidos son: ${Object.values(EstadoProducto).join(', ')}`);
        }

        const productId = uuidv4();
        let imagenURL = null;

        if (file) {
            imagenURL = await this.uploadImageToS3(file, productId);
        }

        const params = {
            TableName: 'productos',
            Item: {
                productoId: productId,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                stockActual: producto.stockActual,
                imagenURL: imagenURL || producto.imagenURL,
                categoria: producto.categoria,
                estado: producto.estado,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        };

        try {
            const command = new PutCommand(params);
            await dynamoDB.send(command);
            return params.Item;
        } catch (error) {
            console.error("Error al crear producto:", error);
            throw error;
        }
    }

    static async update(id, producto, file) {
        if (producto.estado && !Object.values(EstadoProducto).includes(producto.estado)) {
            throw new Error(`Estado inválido. Los estados válidos son: ${Object.values(EstadoProducto).join(', ')}`);
        }

        let imagenURL = null;
        if (file) {
            imagenURL = await this.uploadImageToS3(file, id);
        }

        const updateExpression = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        Object.keys(producto).forEach(key => {
            if (key !== 'id') {
                updateExpression.push(`#${key} = :${key}`);
                expressionAttributeValues[`:${key}`] = producto[key];
                expressionAttributeNames[`#${key}`] = key;
            }
        });

        if (imagenURL) {
            updateExpression.push('#imagenURL = :imagenURL');
            expressionAttributeValues[':imagenURL'] = imagenURL;
            expressionAttributeNames['#imagenURL'] = 'imagenURL';
        }

        updateExpression.push('#updatedAt = :updatedAt');
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();
        expressionAttributeNames['#updatedAt'] = 'updatedAt';

        const params = {
            TableName: 'productos',
            Key: {
                productoId: id
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
            console.error("Error al actualizar producto:", error);
            throw error;
        }
    }

    static async delete(id) {
        const params = {
            TableName: 'productos',
            Key: {
                productoId: id
            }  
        };

        try {
            const command = new DeleteCommand(params);
            await dynamoDB.send(command);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            throw error;
        }
    }
}

module.exports = { ProductoServices };

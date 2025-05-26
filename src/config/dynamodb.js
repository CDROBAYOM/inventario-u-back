require('dotenv').config();

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');


console.log(`Secret: ${process.env.AWS_SECRET_ACCESS_KEY}`);
console.log(`Key: ${process.env.AWS_ACCESS_KEY_ID}`);


const dynamoDBClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

module.exports = dynamoDB; 